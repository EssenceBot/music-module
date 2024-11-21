import { db } from "@essence-discord-bot/index";
import chalk from "chalk";
import { RecordId } from "surrealdb";

export function botLog(message: string) {
  console.log(`${chalk.green("[Music module]")} ${message}`);
}

export function botWarn(message: string) {
  console.warn(`${chalk.green("[Music module]")} ${chalk.red(message)}`);
}

export function botError(message: string, error: Error) {
  console.error(
    `${chalk.green("[Music module]")} ${chalk.red(message)}`,
    error
  );
}

let DBEnabled = (
  await db.select(new RecordId("__module__music_config", "dbEnabled"))
)?.dbEnabled as boolean | undefined;

if (DBEnabled == undefined) {
  botLog(`DB is not initialized for module, initializing...`);
  await db.create(new RecordId("__module__music_config", "dbEnabled"), {
    dbEnabled: false,
  });
  DBEnabled = false;
}

export const isDBEnabled = () => DBEnabled as boolean;
export const setDBEnabled = async (enabled: boolean) => {
  await db.update(new RecordId("__module__music_config", "dbEnabled"), {
    dbEnabled: enabled,
  });
  DBEnabled = enabled;
};

export const getBotChannelId = async () =>
  (await db.select(new RecordId("__module__music_config", "botChannelId")))
    ?.botChannelId as string | undefined;
export const getBotChannelEmbedId = async () =>
  (await db.select(new RecordId("__module__music_config", "botChannelEmbedId")))
    ?.botChannelEmbedId as string | undefined;

export const setBotChannelId = async (channelId: string) => {
  await db.update(new RecordId("__module__music_config", "botChannelId"), {
    botChannelId: channelId,
  });
};

export const setBotChannelEmbedId = async (embedId: string) => {
  await db.update(new RecordId("__module__music_config", "botChannelEmbedId"), {
    botChannelEmbedId: embedId,
  });
};
