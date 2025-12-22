import type { ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

export function initQueueCommand() {
  const queueSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.queue.name"))
      .setDescription(t("pl", "commands.queue.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.queue.description"),
        "en-GB": t("en-GB", "commands.queue.description"),
        pl: t("pl", "commands.queue.description"),
      })
      .addIntegerOption((option) =>
        option
          .setName(t("en-US", "commands.queue.pageName"))
          .setDescription(t("pl", "commands.queue.pageDescription"))
          .setDescriptionLocalizations({
            "en-US": t("en-US", "commands.queue.pageDescription"),
            "en-GB": t("en-GB", "commands.queue.pageDescription"),
            pl: t("pl", "commands.queue.pageDescription"),
          })
          .setMinValue(1)
          .setRequired(false)
      );
  };

  const queueInteractionHandler = async (
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

      const page = interaction.options.getInteger(t("en-US", "commands.queue.pageName")) || 1;
      const tracksPerPage = 10;
      const totalPages = Math.ceil(player.queue.size / tracksPerPage);

      if (page > totalPages && totalPages > 0) {
        await interaction.editReply({
          content: t(locale, "errors.invalidPage", {
            totalPages: totalPages.toString(),
          }),
        });
        return;
      }

      const start = (page - 1) * tracksPerPage;
      const end = start + tracksPerPage;
      const tracks = player.queue.tracks.slice(start, end);

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(t(locale, "embed.queue.title"))
        .setFooter({ 
          text: t(locale, "embed.queue.footer", {
            page: page.toString(),
            totalPages: totalPages.toString() || "1",
            total: player.queue.size.toString(),
          })
        });

      // Add current track
      if (player.current && page === 1) {
        embed.addFields({
          name: t(locale, "embed.queue.nowPlaying"),
          value: `**${player.current.title}** ${player.current.author ? `by ${player.current.author}` : ""}`,
        });
      }

      // Add queue tracks
      if (tracks.length > 0) {
        const queueList = tracks
          .map((track, index) => {
            const position = start + index + 1;
            const duration = track.duration
              ? `\`${Math.floor(track.duration / 60000)}:${String(Math.floor((track.duration % 60000) / 1000)).padStart(2, "0")}\``
              : "";
            return `**${position}.** ${track.title}${track.author ? ` - ${track.author}` : ""} ${duration}`;
          })
          .join("\n");

        embed.addFields({
          name: t(locale, "embed.queue.upcoming"),
          value: queueList,
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      botLog(moduleName, `Error in queue command: ${error}`, "error");
      console.error("Error in queue command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(queueSlashCommandHandler, queueInteractionHandler);
  botLog(moduleName, "Registered slash command: [queue]", "info");
}
