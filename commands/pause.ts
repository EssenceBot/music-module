import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

export function initPauseCommand() {
  const pauseSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.pause.name"))
      .setDescription(t("pl", "commands.pause.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.pause.description"),
        "en-GB": t("en-GB", "commands.pause.description"),
        pl: t("pl", "commands.pause.description"),
      });
  };

  const pauseInteractionHandler = async (
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

      if (player.paused) {
        player.pause();
        await interaction.editReply({
          content: t(locale, "success.playerResumed"),
        });
      } else {
        player.pause();
        await interaction.editReply({
          content: t(locale, "success.playerPaused"),
        });
      }

      Bun.sleep(5000).then(() => interaction.deleteReply());
    } catch (error) {
      botLog(moduleName, `Error in pause command: ${error}`, "error");
      console.error("Error in pause command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(pauseSlashCommandHandler, pauseInteractionHandler);
  botLog(moduleName, "Registered slash command: [pause]", "info");
}
