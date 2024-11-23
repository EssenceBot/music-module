import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";
import { updateEmbed } from "../embedManager";

export const pauseSlashCommandHandler = async (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("pause").setDescription("Pause the current track");
};

export const pauseInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  handlePause(interaction);
};

export const handlePause = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction
) => {
  const voiceChannel = (interaction.member as GuildMember)?.voice.channel;
  if (!voiceChannel) {
    await interaction.reply({
      content: "You need to be in a voice channel",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  const player = rainlink.players.get(interaction.guildId as string);
  if (!player) {
    await interaction.reply({
      content: "There is no player on current server",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  if (voiceChannel.id !== player.voiceId) {
    await interaction.reply({
      content: "You need to be in the same voice channel as the bot",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  if (player.paused) {
    await player.resume();
    updateEmbed(interaction.guildId as string);
    await interaction.reply({
      content: "Player resumed",
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  await player.pause();
  updateEmbed(interaction.guildId as string);
  await interaction.reply({
    content: "Player paused",
  });
  Bun.sleep(5000).then(() => interaction.deleteReply());
};
