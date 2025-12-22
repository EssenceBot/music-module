import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

export function initClearCommand() {
  const clearSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.clear.name"))
      .setDescription(t("pl", "commands.clear.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.clear.description"),
        "en-GB": t("en-GB", "commands.clear.description"),
        pl: t("pl", "commands.clear.description"),
      });
  };

  const clearInteractionHandler = async (
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

      if (!player.current && player.queue.size === 0) {
        await interaction.editReply({
          content: t(locale, "errors.queueEmpty"),
        });
        return;
      }

      player.queue.clear();
      player.stop();
      player.destroy();

      await interaction.editReply({
        content: t(locale, "success.queueCleared"),
      });

      Bun.sleep(5000).then(() => interaction.deleteReply());
    } catch (error) {
      botLog(moduleName, `Error in clear command: ${error}`, "error");
      console.error("Error in clear command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(clearSlashCommandHandler, clearInteractionHandler);
  botLog(moduleName, "Registered slash command: [clear]", "info");
}
