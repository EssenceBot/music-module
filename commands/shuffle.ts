import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  GuildMember,
} from "discord.js";
import { rainlink } from "..";

export const shuffleSlashCommandHandler = (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("shuffle").setDescription("Shuffle the queue");
};

export const shuffleInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  handleShuffle(interaction);
};

export const handleShuffle = async (
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
  player.queue.shuffle();
  await interaction.reply({
    content: "Queue shuffled",
  });
  Bun.sleep(5000).then(() => interaction.deleteReply());
};
