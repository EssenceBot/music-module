import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";

export const previousSlashCommandHandler = (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("previous").setDescription("Previous track in queue");
};

export const previousInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  handlePrevious(interaction);
};

export const handlePrevious = async (
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
  const previousSong = player.getPrevious()[0];
  if (!previousSong) {
    await interaction.reply({
      content: "There is no previous song",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  await interaction.reply({
    content: `Playing previous song: ${previousSong.title}`,
  });
  player.previous();
  Bun.sleep(5000).then(() => interaction.deleteReply());
};
