import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";
import { playingEmbed } from "../embeds/playing.js";

export function initSongCommand() {
  const songSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.song.name"))
      .setDescription(t("pl", "commands.song.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.song.description"),
        "en-GB": t("en-GB", "commands.song.description"),
        pl: t("pl", "commands.song.description"),
      });
  };

  const songInteractionHandler = async (
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply();
    const locale = interaction.locale;

    try {
      const player = client.moonlink.players.get(interaction.guildId as string);
      
      if (!player) {
        await interaction.editReply({
          content: t(locale, "errors.noPlayerActive"),
        });
        return;
      }

      if (!player.current) {
        await interaction.editReply({
          content: t(locale, "errors.noTrackPlaying"),
        });
        return;
      }

      const track = player.current;
      
      const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
          return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
        }
        return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
      };

      const getLoopStatus = () => {
        if (player.loop === "queue") return "🔁 Queue";
        if (player.loop === "track") return "🔂 Track";
        return "❌ Off";
      };

      const getCurrentStatus = () => {
        if (player.paused) return "⏸️ Paused";
        if (player.playing) return "▶️ Playing";
        return "⏹️ Stopped";
      };

      const embed = playingEmbed(
        locale,
        track.title,
        track.url || "",
        track.author || "Unknown",
        track.artworkUrl || "https://via.placeholder.com/300x300?text=No+Artwork",
        (track as any).requester || interaction.user.id,
        formatDuration(track.duration),
        player.volume,
        String(player.queue.size),
        getCurrentStatus(),
        getLoopStatus()
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      botLog(moduleName, `Error in song command: ${error}`, "error");
      console.error("Error in song command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(songSlashCommandHandler, songInteractionHandler);
  botLog(moduleName, "Registered slash command: [song]", "info");
}
