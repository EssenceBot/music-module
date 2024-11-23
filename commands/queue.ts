import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";

export const queueSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
  slashCommand.setName("queue").setDescription("Shows the queue");
};

export const queueInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  handleQueue(interaction);
};

export const handleQueue = async (
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
  const queue = player.queue;
  if (queue.length === 0) {
    await interaction.reply({
      content: "Queue is empty",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  const queueString = queue
    .map((song, index) => `${index + 1}. ${song.title}`)
    .join("\n");
  await interaction.reply({
    content: `Queue:\n${queueString}`,
  });
  Bun.sleep(5000).then(() => interaction.deleteReply());
};
