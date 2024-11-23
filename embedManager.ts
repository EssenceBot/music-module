import type { RainlinkLoopMode } from "rainlink";
import { rainlink } from ".";
import { playingEmbed } from "./embeds/playing";
import { waitingEmbed } from "./embeds/waiting";
import { getBotChannelEmbedId, getBotChannelId, getVolume } from "./lib";
import { getClient } from "@essence-discord-bot/api/botExtension";
import type { TextChannel } from "discord.js";

const getPlayer = (guildId: string) => rainlink.players.get(guildId);
const client = getClient();

export const updateEmbed = async (guildId: string) => {
  const botChannelId = await getBotChannelId(guildId);
  if (!botChannelId) return;
  const botEmbedId = await getBotChannelEmbedId(botChannelId);
  if (!botEmbedId) return;
  const message = await (
    client.channels.cache.get(botChannelId) as TextChannel
  ).messages.fetch(botEmbedId);
  const newMessage = (await createMessage(guildId)) as any;
  await message.edit(newMessage);
};

export const createMessage = async (guildId: string) => {
  const player = getPlayer(guildId);
  const volume = (await getVolume(guildId)) ?? 40;
  const loopMode = () => {
    const loop = player?.loop as RainlinkLoopMode;
    switch (loop) {
      case "song":
        return "Song";
      case "queue":
        return "Queue";
      default:
        return "None";
    }
  };
  if (!player) {
    return {
      content: "",
      embeds: [waitingEmbed(volume, loopMode())],
    };
  }
  const songTitle = player.queue.current?.title as string;
  const songUrl = player.queue.current?.uri as string;
  const creatorName = player.queue.current?.author as string;
  const thumbnailUrl = player.queue.current?.artworkUrl as string;
  const requesterId = (player.queue.current?.requester as { id: string }).id;
  const songDuration = () => {
    const duration = player.queue.current?.duration as number;
    if (duration > 3600 * 1000)
      return new Date(duration).toISOString().slice(11, 19);
    return new Date(duration).toISOString().slice(14, 19);
  };
  const queueLength = player.queue.length + 1;
  const currentStatus = (player.playing ? "Playing" : "Paused") as string;
  return {
    content: "",
    embeds: [
      playingEmbed(
        songTitle,
        songUrl,
        creatorName,
        thumbnailUrl,
        requesterId,
        songDuration(),
        volume,
        queueLength,
        currentStatus,
        loopMode()
      ),
    ],
  };
};
