import { Manager } from "moonlink.js";
import { getClient } from "@essence-discord-bot/api/botExtension";
import botLog from "@essence-discord-bot/lib/log";
import type { MoonlinkClient, LavalinkNode } from "./types";
import { initPlayCommand } from "./commands/play.js";
import { initSkipCommand } from "./commands/skip.js";
import { initLoopCommand } from "./commands/loop.js";
import { initVolumeCommand } from "./commands/volume.js";
import { initClearCommand } from "./commands/clear.js";
import { initPauseCommand } from "./commands/pause.js";
import { initShuffleCommand } from "./commands/shuffle.js";
import { initPreviousCommand } from "./commands/previous.js";
import { initQueueCommand } from "./commands/queue.js";
import { initSeekCommand } from "./commands/seek.js";
import { initSongCommand } from "./commands/song.js";
import { initRemoveCommand } from "./commands/remove.js";

export const client = getClient() as MoonlinkClient;
export const moduleName = "Music";
let nodeCounter = 0;

function createNode(
  host: string | undefined,
  port: string | undefined,
  password: string | undefined,
  secure: string | undefined,
  nodeCounter: number
) {
  nodeCounter++;
  const nodeHost = () => {
    if (!host) {
      botLog(
        moduleName,
        `Lavalink host for node ${nodeCounter} is not defined, using default localhost.`,
        "warn"
      );
      return "localhost";
    }
    return host;
  };
  const nodePort = () => {
    if (!port) {
      botLog(
        moduleName,
        `Lavalink port for node ${nodeCounter} is not defined, using default 2333.`,
        "warn"
      );
      return 2333;
    }
    return parseInt(port);
  };
  const nodePassword = () => {
    if (!password) {
      botLog(
        moduleName,
        `Lavalink password for node ${nodeCounter} is not defined, using default 'youshallnotpass'.`,
        "warn"
      );
      return "youshallnotpass";
    }
    return password;
  };
  const nodeSecure = () => {
    if (!secure) {
      botLog(
        moduleName,
        `Lavalink secure for node ${nodeCounter} is not defined, using default false.`,
        "warn"
      );
      return false;
    }
    return secure === "true" || secure === "1" || secure === "yes";
  };
  return {
    host: nodeHost(),
    port: nodePort(),
    password: nodePassword(),
    secure: nodeSecure(),
  };
}

const nodes: LavalinkNode[] = [];

function buildNodesFromEnv() {
  let index = 1;
  while (process.env[`LAVALINK_HOST_${index}`]) {
    const node = createNode(
      process.env[`LAVALINK_HOST_${index}`],
      process.env[`LAVALINK_PORT_${index}`],
      process.env[`LAVALINK_PASSWORD_${index}`],
      process.env[`LAVALINK_SECURE_${index}`],
      nodeCounter
    );
    botLog(
      moduleName,
      `Configured node ${index}: ${node.secure ? "wss" : "ws"}://${node.host}:${node.port}`,
      "info"
    );
    nodes.push(node);

    index++;
  }

  if (nodes.length === 0) {
    const node = createNode(
      process.env.LAVALINK_HOST,
      process.env.LAVALINK_PORT,
      process.env.LAVALINK_PASSWORD,
      process.env.LAVALINK_SECURE,
      nodeCounter
    );
    botLog(
      moduleName,
      `Configured fallback node: ${node.secure ? "wss" : "ws"}://${node.host}:${node.port}`,
      "info"
    );
    nodes.push(node);
  }

  if (nodes.length === 0) {
    botLog(
      moduleName,
      "No Lavalink nodes configured. Please set environment variables.",
      "error"
    );
    throw new Error("No Lavalink nodes configured");
  }
}

export function discordBotInit() {
  buildNodesFromEnv();

  const manager = new Manager({
    nodes,
    options: {
      spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    },
    sendPayload: (guildId: string, payload: string) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) {
        guild.shard.send(JSON.parse(payload));
      }
    },
  });
  
  if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
    botLog(moduleName, "Spotify integration configured with client credentials");
  } else {
    botLog(
      moduleName,
      "Spotify credentials not found. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to enable Spotify support.",
      "warn"
    );
  }
  
  client.moonlink = manager;
  client.on("raw", (packet) => {
    client.moonlink.packetUpdate(packet);
  });

  initPlayCommand();
  initSkipCommand();
  initLoopCommand();
  initVolumeCommand();
  initClearCommand();
  initPauseCommand();
  initShuffleCommand();
  initPreviousCommand();
  initQueueCommand();
  initSeekCommand();
  initSongCommand();
  initRemoveCommand();
  setupEventListeners();
}

export async function lateDiscordBotInit() {
  await client.moonlink.init(client?.user?.id as string);
  botLog(moduleName, "Moonlink initialized successfully.");
  botLog(
    moduleName,
    `Connected nodes: ${client.moonlink.nodes.nodes.size}`,
    "info"
  );
}

function setupEventListeners() {
  client.moonlink.on('nodeConnected', (node) => {
    botLog(
      moduleName, 
      `Lavalink node connected: ${node.identifier || node.host} (${node.secure ? 'wss' : 'ws'}://${node.host}:${node.port})`
    );
  });

  client.moonlink.on('nodeDisconnect', (node, code, reason) => {
    botLog(
      moduleName, 
      `Lavalink node disconnected: ${node.identifier || node.host} (code: ${code}, reason: ${reason})`, 
      "warn"
    );
  });

  client.moonlink.on('nodeError', (node, error) => {
    botLog(
      moduleName, 
      `Lavalink node error on ${node.identifier || node.host}: ${error.message}`, 
      "error"
    );
  });

  client.moonlink.on('trackStart', (player, track) => {
    botLog(moduleName, `Track started: ${track.title} in guild ${player.guildId}`);
  });

  client.moonlink.on('trackEnd', (player, track, type) => {
    botLog(moduleName, `Track ended: ${track.title} in guild ${player.guildId} | Type: ${type}`);
  });

  client.moonlink.on('queueEnd', (player) => {
    botLog(moduleName, `Queue ended in guild ${player.guildId}`);
    setTimeout(() => {
      if (!player.playing && player.queue.size === 0) {
        player.destroy();
      }
      botLog(moduleName, `Player destroyed for guild ${player.guildId} due to inactivity.`);
    }, 30000);
  });

}

export { default as database } from "./lib/database.js";
