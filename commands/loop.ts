import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index";
import { moduleName } from "../index";
import { t } from "../lib/i18n";

export function initLoopCommand() {
  const loopSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.loop.name"))
      .setDescription(t("pl", "commands.loop.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.loop.description"),
        "en-GB": t("en-GB", "commands.loop.description"),
        pl: t("pl", "commands.loop.description"),
      })
      .addStringOption((option) =>
        option
          .setName(t("en-US", "commands.loop.modeName"))
          .setDescription(t("pl", "commands.loop.modeDescription"))
          .setDescriptionLocalizations({
            "en-US": t("en-US", "commands.loop.modeDescription"),
            "en-GB": t("en-GB", "commands.loop.modeDescription"),
            pl: t("pl", "commands.loop.modeDescription"),
          })
          .setRequired(true)
          .addChoices(
            { name: "Off", value: "off" },
            { name: "Track", value: "track" },
            { name: "Queue", value: "queue" }
          )
      );
  };

  const loopInteractionHandler = async (
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

      const mode = interaction.options.getString(t("en-US", "commands.loop.modeName"), true);
      
      switch (mode) {
        case "off":
          player.setLoop("off");
          await interaction.editReply({
            content: t(locale, "success.loopDisabled"),
          });
          break;
        case "track":
          player.setLoop("track");
          await interaction.editReply({
            content: t(locale, "success.loopTrack"),
          });
          break;
        case "queue":
          player.setLoop("queue");
          await interaction.editReply({
            content: t(locale, "success.loopQueue"),
          });
          break;
      }
    } catch (error) {
      botLog(moduleName, `Error in loop command: ${error}`, "error");
      console.error("Error in loop command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(loopSlashCommandHandler, loopInteractionHandler);
  botLog(moduleName, "Registered slash command: [loop]", "info");
}
