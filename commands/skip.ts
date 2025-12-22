import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index";
import { moduleName } from "../index";
import { t } from "../lib/i18n";

export function initSkipCommand() {
  const skipSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.skip.name"))
      .setDescription(t("pl", "commands.skip.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.skip.description"),
        "en-GB": t("en-GB", "commands.skip.description"),
        pl: t("pl", "commands.skip.description"),
      });
  };

  const skipInteractionHandler = async (
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

      const currentTrack = player.current;
      
      player.skip();

      await interaction.editReply({
        content: t(locale, "success.trackSkipped", {
          title: currentTrack.title,
        }),
      });
    } catch (error) {
      botLog(moduleName, `Error in skip command: ${error}`, "error");
      console.error("Error in skip command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(skipSlashCommandHandler, skipInteractionHandler);
  botLog(moduleName, "Registered slash command: [skip]", "info");
}
