import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index.js";
import { moduleName } from "../index.js";
import { t } from "../lib/i18n.js";

function parseTime(timeStr: string): number {
  // Parse time in format: XhYmZs, Xh, Ym, Zs, X:Y:Z, X:Y, etc.
  const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
  const colonFormat = /^(?:(\d+):)?(\d+):(\d+)$/; // H:M:S or M:S

  let hours = 0, minutes = 0, seconds = 0;

  // Try colon format first (H:M:S or M:S)
  const colonMatch = timeStr.match(colonFormat);
  if (colonMatch) {
    if (colonMatch[1] !== undefined) {
      // H:M:S format
      hours = parseInt(colonMatch[1]);
      minutes = parseInt(colonMatch[2]);
      seconds = parseInt(colonMatch[3]);
    } else {
      // M:S format
      minutes = parseInt(colonMatch[2]);
      seconds = parseInt(colonMatch[3]);
    }
  } else {
    // Try XhYmZs format
    const match = timeStr.match(regex);
    if (match) {
      hours = parseInt(match[1] || "0");
      minutes = parseInt(match[2] || "0");
      seconds = parseInt(match[3] || "0");
    }
  }

  return (hours * 3600 + minutes * 60 + seconds) * 1000; // Return in milliseconds
}

export function initSeekCommand() {
  const seekSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.seek.name"))
      .setDescription(t("pl", "commands.seek.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.seek.description"),
        "en-GB": t("en-GB", "commands.seek.description"),
        pl: t("pl", "commands.seek.description"),
      })
      .addStringOption((option) =>
        option
          .setName(t("pl", "commands.seek.timeName"))
          .setDescription(t("pl", "commands.seek.timeDescription"))
          .setDescriptionLocalizations({
            "en-US": t("en-US", "commands.seek.timeDescription"),
            "en-GB": t("en-GB", "commands.seek.timeDescription"),
            pl: t("pl", "commands.seek.timeDescription"),
          })
          .setRequired(true)
      );
  };

  const seekInteractionHandler = async (
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

      const timeStr = interaction.options.getString(t("pl", "commands.seek.timeName"), true);
      const timeMs = parseTime(timeStr);

      if (timeMs === 0 || isNaN(timeMs)) {
        await interaction.editReply({
          content: t(locale, "errors.invalidTimeFormat"),
        });
        return;
      }

      if (!player.current.isSeekable) {
        await interaction.editReply({
          content: t(locale, "errors.trackNotSeekable"),
        });
        return;
      }

      if (timeMs > player.current.duration) {
        await interaction.editReply({
          content: t(locale, "errors.seekBeyondDuration"),
        });
        return;
      }

      await player.seek(timeMs);

      const formattedTime = `${Math.floor(timeMs / 60000)}:${String(Math.floor((timeMs % 60000) / 1000)).padStart(2, "0")}`;

      await interaction.editReply({
        content: t(locale, "success.seeked", {
          time: formattedTime,
        }),
      });

      Bun.sleep(5000).then(() => interaction.deleteReply());
    } catch (error) {
      botLog(moduleName, `Error in seek command: ${error}`, "error");
      console.error("Error in seek command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(seekSlashCommandHandler, seekInteractionHandler);
  botLog(moduleName, "Registered slash command: [seek]", "info");
}
