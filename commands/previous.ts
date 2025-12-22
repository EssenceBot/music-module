import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

export function initPreviousCommand() {
  const previousSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.previous.name"))
      .setDescription(t("pl", "commands.previous.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.previous.description"),
        "en-GB": t("en-GB", "commands.previous.description"),
        pl: t("pl", "commands.previous.description"),
      });
  };

  const previousInteractionHandler = async (
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

      // Check if there's a previous track
      const previousTracks = player.queue.previous;
      if (!previousTracks || previousTracks.length === 0) {
        await interaction.editReply({
          content: t(locale, "errors.noPreviousTrack"),
        });
        return;
      }

      const previousTrack = previousTracks[previousTracks.length - 1];

      // Add the current track back to the front of the queue if exists
      if (player.current) {
        player.queue.unshift(player.current);
      }

      // Add the previous track to the front and skip to it
      player.queue.unshift(previousTrack);
      player.skip();

      await interaction.editReply({
        content: t(locale, "success.playingPrevious", {
          title: previousTrack.title,
        }),
      });

      Bun.sleep(5000).then(() => interaction.deleteReply());
    } catch (error) {
      botLog(moduleName, `Error in previous command: ${error}`, "error");
      console.error("Error in previous command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(previousSlashCommandHandler, previousInteractionHandler);
  botLog(moduleName, "Registered slash command: [previous]", "info");
}
