import type { ChatInputCommandInteraction } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionFlagsBits } from "discord.js";
import { createSlashCommand } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import { client } from "../index";
import { moduleName } from "../index";
import { t } from "../lib/i18n";
import {
  getDatabaseClient,
  isDatabaseAvailable,
} from "@essence-discord-bot/api/botExtension";
import { eq } from "drizzle-orm";
import { guildVolumeSettings } from "../schema";

export function initVolumeCommand() {
  const volumeSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand
      .setName(t("pl", "commands.volume.name"))
      .setDescription(t("pl", "commands.volume.description"))
      .setDescriptionLocalizations({
        "en-US": t("en-US", "commands.volume.description"),
        "en-GB": t("en-GB", "commands.volume.description"),
        pl: t("pl", "commands.volume.description"),
      })
      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator | 
        PermissionFlagsBits.ManageGuild | 
        PermissionFlagsBits.ModerateMembers
      )
      .addIntegerOption((option) =>
        option
          .setName(t("en-US", "commands.volume.levelName"))
          .setDescription(t("pl", "commands.volume.levelDescription"))
          .setDescriptionLocalizations({
            "en-US": t("en-US", "commands.volume.levelDescription"),
            "en-GB": t("en-GB", "commands.volume.levelDescription"),
            pl: t("pl", "commands.volume.levelDescription"),
          })
          .setRequired(false)
          .setMinValue(0)
          .setMaxValue(200)
      );
  };

  const volumeInteractionHandler = async (
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply();
    const locale = interaction.locale;

    try {
      // Check permissions
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      const isOwner = interaction.guild?.ownerId === interaction.user.id;
      const hasAdminPerms = member?.permissions.has(PermissionFlagsBits.Administrator);
      const hasModPerms = member?.permissions.has(PermissionFlagsBits.ManageGuild) || 
                         member?.permissions.has(PermissionFlagsBits.ModerateMembers);

      if (!isOwner && !hasAdminPerms && !hasModPerms) {
        await interaction.editReply({
          content: t(locale, "errors.noPermission"),
        });
        return;
      }

      const player = client.moonlink.players.get(interaction.guildId as string);
      const volume = interaction.options.getInteger(t("en-US", "commands.volume.levelName"));

      // If no volume specified, show current volume
      if (volume === null) {
        let currentVolume = 100; // default

        if (player) {
          currentVolume = player.volume;
        } else if (isDatabaseAvailable()) {
          // Load from database
          const db = getDatabaseClient();
          const settings = await db
            .select()
            .from(guildVolumeSettings)
            .where(eq(guildVolumeSettings.guildId, interaction.guildId as string))
            .limit(1);

          if (settings.length > 0) {
            currentVolume = settings[0].volume;
          }
        }

        await interaction.editReply({
          content: t(locale, "success.volumeCurrent", {
            volume: currentVolume,
          }),
        });
        return;
      }

      // Validate volume
      if (volume < 0 || volume > 200) {
        await interaction.editReply({
          content: t(locale, "errors.invalidVolume"),
        });
        return;
      }

      // Set volume on active player
      if (player) {
        player.setVolume(volume);
      }

      // Save to database
      if (isDatabaseAvailable()) {
        const db = getDatabaseClient();
        await db
          .insert(guildVolumeSettings)
          .values({
            guildId: interaction.guildId as string,
            volume: volume,
          })
          .onConflictDoUpdate({
            target: guildVolumeSettings.guildId,
            set: {
              volume: volume,
              updatedAt: new Date(),
            },
          });
      }

      await interaction.editReply({
        content: t(locale, "success.volumeSet", {
          volume: volume,
        }),
      });
    } catch (error) {
      botLog(moduleName, `Error in volume command: ${error}`, "error");
      console.error("Error in volume command:", error);
      await interaction.editReply({
        content: t(locale, "errors.generalError"),
      });
    }
  };

  createSlashCommand(volumeSlashCommandHandler, volumeInteractionHandler);
  botLog(moduleName, "Registered slash command: [volume]", "info");
}
