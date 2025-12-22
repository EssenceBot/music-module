import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

export function initShuffleCommand() {
  const shuffleSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.shuffle.name"))
      .setDescription(t("pl", "commands.shuffle.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.shuffle.description"),
        "en-GB": t("en-GB", "commands.shuffle.description"),
        pl: t("pl", "commands.shuffle.description"),
      });
  };

  const shuffleInteractionHandler = async (
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

      if (player.queue.size === 0) {
        await interaction.editReply({
          content: t(locale, "errors.queueEmpty"),
        });
        return;
      }

      player.queue.shuffle();

      await interaction.editReply({
        content: t(locale, "success.queueShuffled"),
      });

      Bun.sleep(5000).then(() => interaction.deleteReply());
    } catch (error) {
      botLog(moduleName, `Error in shuffle command: ${error}`, "error");
      console.error("Error in shuffle command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(shuffleSlashCommandHandler, shuffleInteractionHandler);
  botLog(moduleName, "Registered slash command: [shuffle]", "info");
}
