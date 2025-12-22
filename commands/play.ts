import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index";
import { moduleName } from "../index";
import { t } from "../lib/i18n";
import { playingEmbed } from "../embeds/playing";
import {
  getDatabaseClient,
  isDatabaseAvailable,
} from "@essence-discord-bot/api/botExtension";
import { eq } from "drizzle-orm";
import { guildVolumeSettings } from "../schema";

export function initPlayCommand() {
  const playSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.play.name"))
      .setDescription(t("pl", "commands.play.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.play.description"),
        "en-GB": t("en-GB", "commands.play.description"),
        pl: t("pl", "commands.play.description"),
      })
      .addStringOption((option) =>
        option
          .setName(t("en-US", "commands.play.queryName"))
          .setDescription(t("pl", "commands.play.queryDescription"))
          .setDescriptionLocalizations({
            "en-US": t("en-US", "commands.play.queryDescription"),
            "en-GB": t("en-GB", "commands.play.queryDescription"),
            pl: t("pl", "commands.play.queryDescription"),
          })
          .setRequired(true)
      );
  };

  const playInteractionHandler = async (
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply();
    const locale = interaction.locale;

    try {
      // Step 1: Check if the user is in a voice channel
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      const voiceChannel = member?.voice.channel;

      if (!voiceChannel) {
        await interaction.editReply({
          content: t(locale, "errors.voiceChannelRequired"),
        });
        return;
      }
      const query = interaction.options.getString(t(locale, "commands.play.queryName"), true);

      if (!client.moonlink.nodes.cache.size) {
        await interaction.editReply({
          content: t(locale, "errors.noLavalinkNodes"),
        });
        return;
      }

      const existingPlayer = client.moonlink.players.get(interaction.guildId as string);
      
      const player = existingPlayer ?? (() => {
        const createdPlayer = client.moonlink.players.create({
          guildId: interaction.guildId as string,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          autoPlay: false,
        });
        
        if (!createdPlayer) {
          throw new Error("Failed to create player");
        }
        
        // Load saved volume from database
        if (isDatabaseAvailable()) {
          getDatabaseClient()
            .select()
            .from(guildVolumeSettings)
            .where(eq(guildVolumeSettings.guildId, interaction.guildId as string))
            .limit(1)
            .then((settings: typeof guildVolumeSettings.$inferSelect[]) => {
              if (settings.length > 0) {
                createdPlayer.setVolume(settings[0].volume);
                botLog(moduleName, `Loaded saved volume ${settings[0].volume} for guild ${interaction.guildId}`);
              }
            })
            .catch((error: Error) => {
              botLog(moduleName, `Failed to load volume from database: ${error}`, "warn");
            });
        }
        
        return createdPlayer;
      })();
      
      if (!existingPlayer && !player) {
        await interaction.editReply({
          content: t(locale, "errors.playerCreationFailed"),
        });
        return;
      }

      if (!player.connected) {
        player.connect();
      }

      botLog(moduleName, `Searching for: ${query}`);
      
      const searchResult = await client.moonlink.search({
        query: query,
        requester: interaction.user.id,
      });
      
      botLog(moduleName, `Search result - loadType: ${searchResult.loadType}, tracks: ${searchResult.tracks.length}`);

      if (!searchResult.tracks.length) {
        await interaction.editReply({
          content: t(locale, "errors.noResults"),
        });
        return;
      }

      switch (searchResult.loadType) {
        case "playlist":
          player.queue.add(searchResult.tracks);

          const firstTrack = searchResult.tracks[0];
          const formatDurationPlaylist = (ms: number) => {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            if (hours > 0) {
              return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
            }
            return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
          };
          
          const getLoopStatusPlaylist = () => {
            if (player.loop === "queue") return "Queue";
            if (player.loop === "track") return "Track";
            return "Off";
          };
          
          const willStartPlayingPlaylist = !player.playing && !player.paused;
          
          const getPlayerStatusPlaylist = () => {
            if (player.playing) return "Playing";
            if (player.paused) return "Paused";
            if (willStartPlayingPlaylist) return "Playing";
            return "Queued";
          };

          await interaction.editReply({
            content: t(locale, "success.playlistAdded", {
              name: searchResult.playlistInfo?.name || "Unknown",
              count: searchResult.tracks.length,
            }),
            embeds: [playingEmbed(
              locale,
              firstTrack.title,
              firstTrack.url || "",
              firstTrack.author,
              firstTrack.artworkUrl || "",
              interaction.user.id,
              formatDurationPlaylist(firstTrack.duration),
              player.volume,
              String(player.queue.size),
              getPlayerStatusPlaylist(),
              getLoopStatusPlaylist()
            )]
          });

          if (willStartPlayingPlaylist) {
            player.play();
          }
          break;

        case "search":
        case "track":
          const track = searchResult.tracks[0];
          player.queue.add(track);

          const formatDuration = (ms: number) => {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            if (hours > 0) {
              return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
            }
            return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
          };
          
          const getLoopStatus = () => {
            if (player.loop === "queue") return "Queue";
            if (player.loop === "track") return "Track";
            return "Off";
          };
          
          const willStartPlaying = !player.playing && !player.paused;
          
          const getPlayerStatus = () => {
            if (player.playing) return "Playing";
            if (player.paused) return "Paused";
            if (willStartPlaying) return "Playing";
            return "Queued";
          };

          await interaction.editReply({
            embeds: [playingEmbed(
              locale,
              track.title,
              track.url || "",
              track.author,
              track.artworkUrl || "",
              interaction.user.id,
              formatDuration(track.duration),
              player.volume,
              String(player.queue.size),
              getPlayerStatus(),
              getLoopStatus()
            )]
          });

          if (willStartPlaying) {
            player.play();
          }
          break;

        case "empty":
          await interaction.editReply({
            content: t(locale, "errors.noMatches"),
          });
          break;

        case "error":
          botLog(moduleName, `Search error for query: ${query}`, "error");
          await interaction.editReply({
            content: t(locale, "errors.loadTrackError"),
          });
          break;
      }
    } catch (error) {
      botLog(moduleName, `Error in play command: ${error}`, "error");
      console.error("Error in play command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(playSlashCommandHandler, playInteractionHandler);
  botLog(moduleName, "Registered slash command: [play]", "info");
}
