import {
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
  if (interaction.channel?.type === ChannelType.GuildText) {
    const guildId = interaction.guildId as string;
    const voiceChannel = (interaction.member as GuildMember)?.voice.channel;
    if (!voiceChannel) {
      await interaction.reply({
        content: "You need to be in a voice channel",
        ephemeral: true,
      });
      Bun.sleep(3000).then(() => interaction.deleteReply());
      return;
    }
    const player = rainlink.players.get(guildId) as RainlinkPlayer;
    if (!player) {
      await interaction.reply({
        content: "There is no player on current server",
        ephemeral: true,
      });
      Bun.sleep(3000).then(() => interaction.deleteReply());
      return;
    }
    const currentSong = player.queue.current?.title;
    await player.skip();
    await interaction.reply({
      content: `Skipped ${currentSong}`,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
    return;
  } else {
    await interaction.reply({
      content: "This command can only be used in a server",
      ephemeral: true,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
  }
};
