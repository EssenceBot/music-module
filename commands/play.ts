import {
  ChannelType,
  type User,
  type ChatInputCommandInteraction,
  type GuildMember,
  type SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { bot } from "@essence-discord-bot/index";
import { rainlink } from "..";

export const playSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
  slashCommand
    .setName("play")
    .setDescription("Add a track to queue and play it")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query or URL")
        .setRequired(true)
    );
};

export const playInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const query = interaction.options.getString("query") as string;
  console.log(`Query: ${query}`);
  if (interaction.channel?.type === ChannelType.GuildText) {
    const guildId = interaction.guildId as string;
    const textId = interaction.channelId as string;
    const shardId = interaction.guild?.shardId as number;
    const user = interaction.user;
    const member = interaction.member as GuildMember;

    await handlePlay(
      guildId,
      textId,
      shardId,
      user,
      member,
      query,
      interaction
    );
  } else {
    await interaction.reply({
      content: "This command can only be used in a server",
      ephemeral: true,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
  }
};

export const handlePlay = async (
  guildId: string,
  textId: string,
  shardId: number,
  user: User,
  member: GuildMember,
  query: string,
  interaction?: ChatInputCommandInteraction
) => {
  const voiceChannel = (member as GuildMember)?.voice.channel;
  const channel = bot.channels.cache.get(textId) as TextChannel | undefined;
  if (!channel) {
    console.log("Channel not found");
    return;
  }
  if (voiceChannel) {
    let player = rainlink.players.get(guildId);
    if (!player) {
      player = await rainlink.create({
        guildId: guildId,
        textId: textId,
        voiceId: voiceChannel.id,
        shardId: shardId,
        volume: 40,
      });
    } else if (
      voiceChannel !== bot.guilds.cache.get(guildId)?.members?.me?.voice.channel
    ) {
      if (interaction) {
        await interaction.reply({
          content: "Bot is not in the same voice channel",
          ephemeral: true,
        });
        Bun.sleep(3000).then(() => interaction.deleteReply());
      } else {
        channel.send("Bot is not in the same voice channel");
        Bun.sleep(3000).then(() => channel.delete());
      }
      return;
    }
    const result = await rainlink.search(query, {
      requester: user,
    });

    if (!result.tracks.length) {
      if (interaction) {
        await interaction.reply({
          content: "No tracks found",
          ephemeral: true,
        });
        Bun.sleep(3000).then(() => interaction.deleteReply());
      } else {
        const message = await channel.send("No tracks found");
        Bun.sleep(3000).then(() => message.delete());
      }
      return;
    }
    if (result.type === "PLAYLIST")
      for (let track of result.tracks) player.queue.add(track);
    else if (player.playing && result.type === "SEARCH")
      player.queue.add(result.tracks[0]);
    else if (player.playing && result.type !== "SEARCH")
      for (let track of result.tracks) player.queue.add(track);
    else player.queue.add(result.tracks[0]);
    if (!player.playing) player.play();
    if (interaction) {
      await interaction.reply({
        content:
          result.type === "PLAYLIST"
            ? `Queued ${result.tracks.length} from ${result.playlistName}`
            : `Queued ${result.tracks[0].title}`,
      });
      Bun.sleep(3000).then(() => interaction.deleteReply());
    } else {
      const message = await channel.send(
        result.type === "PLAYLIST"
          ? `Queued ${result.tracks.length} from ${result.playlistName}`
          : `Queued ${result.tracks[0].title}`
      );
      Bun.sleep(3000).then(() => message.delete());
    }
    return;
  } else {
    if (interaction) {
      await interaction.reply({
        content: "You need to be in a voice channel",
        ephemeral: true,
      });
      Bun.sleep(3000).then(() => interaction.deleteReply());
    } else {
      channel.send("You need to be in a voice channel");
      Bun.sleep(3000).then(() => channel.delete());
    }
  }
};
