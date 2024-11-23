import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";

export const seekSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
  slashCommand
    .setName("seek")
    .setDescription("Seek the current track")
    .addStringOption((option) =>
      option.setName("time").setDescription("Time to seek to").setRequired(true)
    );
};

export const seekInteractionHandler = async (interaction: any) => {
  const time = interaction.options.getString("time");
  handleSeek(interaction, time);
};

export const handleSeek = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
  time: string
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
  const isSeekable = player.queue.current?.isSeekable;
  if (!isSeekable) {
    await interaction.reply({
      content: "This track is not seekable",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  const timeInSeconds = parseTime(time);
  if (timeInSeconds < 0) {
    await interaction.reply({
      content: "Invalid time format",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  await player.seek(timeInSeconds);
  await interaction.reply({
    content: "Seeked to " + time,
  });
  Bun.sleep(5000).then(() => interaction.deleteReply());
};

const parseTime = (time: string) => {
  const timeRegex =
    /(?:\s*(?<hours>\d+)\s*h)?(?:\s*(?<minutes>\d+)\s*m)?(?:\s*(?<seconds>\d+)\s*s)?/gm;
  const match = time.match(timeRegex);
  if (!match || !match.groups) {
    return -1;
  }
  const { hours, minutes, seconds } = match.groups;
  return (
    parseInt(hours ?? "0") * 3600 +
    parseInt(minutes ?? "0") * 60 +
    parseInt(seconds ?? "0")
  );
};
