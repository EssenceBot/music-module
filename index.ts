import { Rainlink, Library } from "rainlink";
import {
  createSlashCommand,
  getClient,
} from "@essence-discord-bot/api/botExtension";
import {
  botError,
  botLog,
  botWarn,
  getBotChannelId,
  getChannelsIds,
  getGuildIdsFromChannelIds,
} from "./lib.ts";
import type { TextChannel } from "discord.js";
import { updateEmbed } from "./embedManager.ts";

import {
  channelSlashCommandHandler,
  channelInteractionHandler,
  createChannelMessageListenerFromId,
} from "./commands/channel.ts";
import {
  clearInteractionHandler,
  clearSlashCommandHandler,
} from "./commands/clear.ts";
import {
  loopSlashCommandHandler,
  loopInteractionHandler,
} from "./commands/loop.ts";
import {
  pauseSlashCommandHandler,
  pauseInteractionHandler,
} from "./commands/pause.ts";
import {
  playSlashCommandHandler,
  playInteractionHandler,
} from "./commands/play.ts";
import {
  previousSlashCommandHandler,
  previousInteractionHandler,
} from "./commands/previous.ts";
import {
  queueSlashCommandHandler,
  queueInteractionHandler,
} from "./commands/queue.ts";
import {
  seekSlashCommandHandler,
  seekInteractionHandler,
} from "./commands/seek.ts";
import {
  shuffleInteractionHandler,
  shuffleSlashCommandHandler,
} from "./commands/shuffle.ts";
import {
  skipSlashCommandHandler,
  skipInteractionHandler,
} from "./commands/skip.ts";
import {
  volumeSlashCommandHandler,
  volumeInteractionHandler,
} from "./commands/volume.ts";

if (!process.env.LAVALINK_HOST) {
  throw new Error("LAVALINK_HOST is not defined");
}
if (process.env.LAVALINK_SECURE === undefined) {
  process.env.LAVALINK_SECURE = "false";
}
if (
  process.env.LAVALINK_SECURE !== "true" &&
  process.env.LAVALINK_SECURE !== "false"
) {
  throw new Error("LAVALINK_SECURE has wrong value");
}
switch (process.env.LAVALINK_DRIVER?.toLowerCase()) {
  case "lavalinkv4":
  case "lavalink/v4/koinu":
  case "lavalink":
    process.env.LAVALINK_DRIVER = "lavalink/v4/koinu";
    break;
  case "lavalinkv3":
  case "lavalink/v3/koto":
    process.env.LAVALINK_DRIVER = "lavalink/v3/koto";
    break;
  case "nodelink":
  case "nodelinkv2":
  case "nodelink/v2/nari":
    process.env.LAVALINK_DRIVER = "nodelink/v2/nari";
    break;
  default:
    process.env.LAVALINK_DRIVER = "lavalink/v4/koinu";
    break;
}

const Nodes = [
  {
    name: process.env.LAVALINK_NAME || "default",
    host: `${process.env.LAVALINK_HOST as string}`,
    port: process.env.LAVALINK_PORT as unknown as number,
    auth: process.env.LAVALINK_PASSWORD || "",
    secure: process.env.LAVALINK_SECURE as unknown as boolean,
    driver: process.env.LAVALINK_DRIVER as string,
  },
];

const client = getClient();

export const rainlink = new Rainlink({
  library: new Library.DiscordJS(client),
  nodes: Nodes,
});

export async function discordBotInit() {
  await messageListenersHandling();
  nodeHandling();
  slashCommandHandling();
  queueHandling();
  botLog(
    `Registered 11 slash commands: [channel, clear, loop, pause, play, previous, queue, seek, shuffle, skip, volume]`
  );
}

export async function lateDiscordBotInit() {
  await embedHandling();
}

async function embedHandling() {
  const ids = await getChannelsIds();
  const guildIds = await getGuildIdsFromChannelIds(ids);
  for (const guildId of guildIds) {
    await updateEmbed(guildId);
  }
}

async function messageListenersHandling() {
  const ids = await getChannelsIds();
  for (const id of ids) {
    createChannelMessageListenerFromId(id);
  }
}

function nodeHandling() {
  rainlink.on("nodeConnect", (node) =>
    botLog(`Lavalink node "${node.options.name}" Ready!`)
  );
  rainlink.on("nodeError", (node, error) =>
    botError(`Lavalink node "${node.options.name}" Error Caught,`, error)
  );
  rainlink.on("nodeClosed", (node) =>
    botWarn(`Lavalink node "${node.options.name}" Closed`)
  );
  rainlink.on("nodeDisconnect", (node, code, reason) => {
    botWarn(
      `Lavalink node "${
        node.options.name
      }" Disconnected, Code ${code}, Reason ${reason || "No reason"}`
    );
  });
}

function slashCommandHandling() {
  createSlashCommand(channelSlashCommandHandler, channelInteractionHandler);
  createSlashCommand(clearSlashCommandHandler, clearInteractionHandler);
  createSlashCommand(loopSlashCommandHandler, loopInteractionHandler);
  createSlashCommand(pauseSlashCommandHandler, pauseInteractionHandler);
  createSlashCommand(playSlashCommandHandler, playInteractionHandler);
  createSlashCommand(previousSlashCommandHandler, previousInteractionHandler);
  createSlashCommand(queueSlashCommandHandler, queueInteractionHandler);
  createSlashCommand(seekSlashCommandHandler, seekInteractionHandler);
  createSlashCommand(shuffleSlashCommandHandler, shuffleInteractionHandler);
  createSlashCommand(skipSlashCommandHandler, skipInteractionHandler);
  createSlashCommand(volumeSlashCommandHandler, volumeInteractionHandler);
}

function queueHandling() {
  rainlink.on("trackStart", async (player, track) => {
    if (await getBotChannelId(player.guildId)) {
      const channel = client.channels.cache.get(
        (await getBotChannelId(player.guildId)) as string
      ) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Now playing: ${track.title}`,
        });
        Bun.sleep(5000).then(() => message.delete());
      }
    } else {
      const channel = client.channels.cache.get(player.textId) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Now playing: ${track.title}`,
        });
        Bun.sleep(5000).then(() => message.delete());
      }
    }
    updateEmbed(player.guildId);
  });

  rainlink.on("trackEnd", async (player) => {
    if (await getBotChannelId(player.guildId)) {
      const channel = client.channels.cache.get(
        (await getBotChannelId(player.guildId)) as string
      ) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Track ended`,
        });
        Bun.sleep(5000).then(() => message.delete());
      }
    } else {
      const channel = client.channels.cache.get(player.textId) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Track ended`,
        });
        Bun.sleep(5000).then(() => message.delete());
      }
    }
  });

  rainlink.on("queueEmpty", async (player) => {
    if (await getBotChannelId(player.guildId)) {
      const channel = client.channels.cache.get(
        (await getBotChannelId(player.guildId)) as string
      ) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Queue is empty`,
        });
        Bun.sleep(5000).then(() => message.delete());
      }
    } else {
      const channel = client.channels.cache.get(player.textId) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Queue is empty`,
        });
        Bun.sleep(5000).then(() => message.delete());
      }
    }
    await player.destroy();
    updateEmbed(player.guildId);
  });
}
