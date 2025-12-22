import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

export function initRemoveCommand() {
  const removeSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("en-US", "commands.remove.name"))
      .setDescription(t("pl", "commands.remove.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.remove.description"),
        "en-GB": t("en-GB", "commands.remove.description"),
        pl: t("pl", "commands.remove.description"),
      })
      .addStringOption((option) =>
        option
          .setName(t("en-US", "commands.remove.positionName"))
          .setDescription(t("pl", "commands.remove.positionDescription"))
          .setDescriptionLocalizations({
            "en-US": t("en-US", "commands.remove.positionDescription"),
            "en-GB": t("en-GB", "commands.remove.positionDescription"),
            pl: t("pl", "commands.remove.positionDescription"),
          })
          .setRequired(true)
      );
  };

  const removeInteractionHandler = async (
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

      const positionInput = interaction.options.getString(
        t("en-US", "commands.remove.positionName"),
        true
      );

      // Parse the input - can be a single number or a range like "21-37"
      let startPos: number;
      let endPos: number;

      if (positionInput.includes("-")) {
        // Range format
        const parts = positionInput.split("-");
        if (parts.length !== 2) {
          await interaction.editReply({
            content: t(locale, "errors.invalidRange"),
          });
          return;
        }

        startPos = parseInt(parts[0].trim());
        endPos = parseInt(parts[1].trim());

        if (isNaN(startPos) || isNaN(endPos)) {
          await interaction.editReply({
            content: t(locale, "errors.invalidRange"),
          });
          return;
        }

        // Ensure start is less than or equal to end
        if (startPos > endPos) {
          [startPos, endPos] = [endPos, startPos];
        }
      } else {
        // Single position
        startPos = parseInt(positionInput.trim());
        endPos = startPos;

        if (isNaN(startPos)) {
          await interaction.editReply({
            content: t(locale, "errors.invalidRange"),
          });
          return;
        }
      }

      // Validate positions are within queue bounds
      if (startPos < 1 || endPos > player.queue.size) {
        await interaction.editReply({
          content: t(locale, "errors.invalidPosition", {
            size: player.queue.size.toString(),
          }),
        });
        return;
      }

      // Remove tracks from queue
      // Queue positions are 1-indexed for users, but array is 0-indexed
      const tracksToRemove = endPos - startPos + 1;
      const removedTracks = player.queue.tracks.splice(startPos - 1, tracksToRemove);

      await interaction.editReply({
        content: t(locale, "success.tracksRemoved", {
          count: removedTracks.length.toString(),
        }),
      });

      botLog(
        moduleName,
        `Removed ${removedTracks.length} track(s) from queue in guild ${interaction.guildId}`,
        "info"
      );
    } catch (error) {
      botLog(moduleName, `Error in remove command: ${error}`, "error");
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(removeSlashCommandHandler, removeInteractionHandler);
}
