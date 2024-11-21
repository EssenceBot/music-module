import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";

export const pauseSlashCommandHandler = async (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("pause").setDescription("Pause the current track");
};

export const pauseInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const player = rainlink.players.get(interaction.guildId as string);
  if (!player) {
    await interaction.reply({
      content: "There is no player on current server",
      ephemeral: true,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
    return;
  }
  if (player.paused) {
    await player.play();
    await interaction.reply({
      content: "Player resumed",
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
    return;
  }
  await player.pause();
  await interaction.reply({
    content: "Player paused",
  });
  Bun.sleep(3000).then(() => interaction.deleteReply());
};
