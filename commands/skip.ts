import {
  ButtonInteraction,
  ChannelType,
  type ChatInputCommandInteraction,
  type GuildMember,
  type SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";
import type { RainlinkPlayer } from "rainlink";

export const skipSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
  slashCommand.setName("skip").setDescription("Skip a track in queue");
};

export const skipInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  handleSkip(interaction);
};

export const handleSkip = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction
) => {
  if (interaction.channel?.type === ChannelType.GuildText) {
    const guildId = interaction.guildId as string;
    const voiceChannel = (interaction.member as GuildMember)?.voice.channel;
    if (!voiceChannel) {
      await interaction.reply({
        content: "You need to be in a voice channel",
        ephemeral: true,
      });
      Bun.sleep(5000).then(() => interaction.deleteReply());
      return;
    }
    const player = rainlink.players.get(guildId) as RainlinkPlayer;
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
    const currentSong = player.queue.current?.title;
    await player.skip();
    await interaction.reply({
      content: `Skipped ${currentSong}`,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  } else {
    await interaction.reply({
      content: "This command can only be used in a server",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
  }
};
