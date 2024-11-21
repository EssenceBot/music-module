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
  isDBEnabled,
} from "./lib.ts";

import {
  channelSlashCommandHandler,
  channelInteractionHandler,
} from "./commands/channel.ts";
import {
  playSlashCommandHandler,
  playInteractionHandler,
} from "./commands/play.ts";
import type { TextChannel } from "discord.js";
import {
  skipSlashCommandHandler,
  skipInteractionHandler,
} from "./commands/skip.ts";
import {
  previousSlashCommandHandler,
  previousInteractionHandler,
} from "./commands/previous.ts";
import {
  pauseSlashCommandHandler,
  pauseInteractionHandler,
} from "./commands/pause.ts";
import {
  loopSlashCommandHandler,
  loopInteractionHandler,
} from "./commands/loop.ts";
import {
  shuffleInteractionHandler,
  shuffleSlashCommandHandler,
} from "./commands/shuffle.ts";
import {
  clearInteractionHandler,
  clearSlashCommandHandler,
} from "./commands/clear.ts";

export const defaultEmbed = {
  color: 0xb4befe,
  author: {
    name: "Essence bot",
  },
  title: "Essence bot music module control",
  fields: [
    {
      name: "Current track",
      value: "No track playing",
    },
  ],
  timestamp: new Date().toISOString(),
};

const client = getClient();

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

export const rainlink = new Rainlink({
  library: new Library.DiscordJS(client),
  nodes: Nodes,
});

export function discordBotInit() {
  nodeHandling();
  slashCommandHandling();
  queueHandling();
  botLog(
    `Registered 7 slash commands: [play, skip, previous, pause, loop, shuffle, clear]`
  );
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
  createSlashCommand(playSlashCommandHandler, playInteractionHandler);
  createSlashCommand(skipSlashCommandHandler, skipInteractionHandler);
  createSlashCommand(previousSlashCommandHandler, previousInteractionHandler);
  createSlashCommand(pauseSlashCommandHandler, pauseInteractionHandler);
  createSlashCommand(loopSlashCommandHandler, loopInteractionHandler);
  createSlashCommand(shuffleSlashCommandHandler, shuffleInteractionHandler);
  createSlashCommand(clearSlashCommandHandler, clearInteractionHandler);
}

function queueHandling() {
  rainlink.on("trackStart", async (player, track) => {
    if (isDBEnabled()) {
      if (await getBotChannelId()) {
        const channel = client.channels.cache.get(
          (await getBotChannelId()) as string
        ) as TextChannel;
        if (channel) {
          channel.send({
            content: `Now playing: ${track.title}`,
          });
        }
      }
    } else {
      const channel = client.channels.cache.get(player.textId) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Now playing: ${track.title}`,
        });
        Bun.sleep(3000).then(() => message.delete());
      }
    }
  });

  rainlink.on("trackEnd", async (player) => {
    if (isDBEnabled()) {
      if (await getBotChannelId()) {
        const channel = client.channels.cache.get(
          (await getBotChannelId()) as string
        ) as TextChannel;
        if (channel) {
          channel.send({
            content: `Track ended`,
          });
        }
      }
    } else {
      const channel = client.channels.cache.get(player.textId) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Track ended`,
        });
        Bun.sleep(3000).then(() => message.delete());
      }
    }
  });

  rainlink.on("queueEmpty", async (player) => {
    if (isDBEnabled()) {
      if (await getBotChannelId()) {
        const channel = client.channels.cache.get(
          (await getBotChannelId()) as string
        ) as TextChannel;
        if (channel) {
          channel.send({
            content: `Queue is empty`,
          });
        }
      }
    } else {
      const channel = client.channels.cache.get(player.textId) as TextChannel;
      if (channel) {
        const message = await channel.send({
          content: `Queue is empty`,
        });
        Bun.sleep(3000).then(() => message.delete());
      }
    }
    player.destroy();
  });
}
