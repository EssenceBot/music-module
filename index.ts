import { Rainlink, Library } from "rainlink";
import {
  createSlashCommand,
  getClient,
} from "@essence-discord-bot/api/botExtension";

import {
  playSlashCommandHandler,
  playInteractionHandler,
} from "./commands/play.ts";
// import {
//   skipSlashCommandHandler,
//   skipInteractionHandler,
// } from "./commands/skip.ts";
// import {
//   previousSlashCommandHandler,
//   previousInteractionHandler,
// } from "./commands/previous.ts";
// import {
//   pauseSlashCommandHandler,
//   pauseInteractionHandler,
// } from "./commands/pause.ts";
// import {
//   loopSlashCommandHandler,
//   loopInteractionHandler,
// } from "./commands/loop.ts";
// import {
//   shuffleInteractionHandler,
//   shuffleSlashCommandHandler,
// } from "./commands/shuffle.ts";
// import {
//   clearInteractionHandler,
//   clearSlashCommandHandler,
// } from "./commands/clear.ts";

const client = getClient();

if (!process.env.LAVALINK_HOST) throw new Error("LAVALINK_HOST is not defined");
if (process.env.LAVALINK_SECURE === undefined)
  process.env.LAVALINK_SECURE = "false";
if (
  process.env.LAVALINK_SECURE !== "true" &&
  process.env.LAVALINK_SECURE !== "false"
)
  throw new Error("LAVALINK_SECURE has wrong value");
switch (process.env.LAVALINK_DRIVER?.toLowerCase()) {
  case "lavalinkv4" || "lavalink/v4/koinu" || "lavalink":
    process.env.LAVALINK_DRIVER = "lavalink/v4/koinu";
    break;
  case "lavalinkv3" || "lavalink/v3/koto":
    process.env.LAVALINK_DRIVER = "lavalink/v3/koto";
    break;
  case "nodelink" || "nodelinkv2" || "nodelink/v2/nari":
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
  rainlink.on("nodeConnect", (node) =>
    console.log(`Lavalink ${node.options.name}: Ready!`)
  );
  rainlink.on("nodeError", (node, error) =>
    console.error(`Lavalink ${node.options.name}: Error Caught,`, error)
  );
  rainlink.on("nodeClosed", (node) =>
    console.warn(`Lavalink ${node.options.name}: Closed`)
  );
  // rainlink.on('debug', (name, info) => console.debug(`Lavalink ${name}: Debug,`, info));
  rainlink.on("nodeDisconnect", (node, code, reason) => {
    console.warn(
      `Lavalink ${node.options.name}: Disconnected, Code ${code}, Reason ${
        reason || "No reason"
      }`
    );
  });
  createSlashCommand(playSlashCommandHandler, playInteractionHandler);
  //   createSlashCommand(skipSlashCommandHandler, skipInteractionHandler);
  //   createSlashCommand(previousSlashCommandHandler, previousInteractionHandler);
  //   createSlashCommand(pauseSlashCommandHandler, pauseInteractionHandler);
  //   createSlashCommand(loopSlashCommandHandler, loopInteractionHandler);
  //   createSlashCommand(shuffleSlashCommandHandler, shuffleInteractionHandler);
  //   createSlashCommand(clearSlashCommandHandler, clearInteractionHandler);
  console.log(
    "[Music module] Registered 7 slash commands: [play, skip, previous, pause, loop, shuffle, clear]"
  );
}
