import { getClient } from "@essence-discord-bot/api/botExtension";
import { db } from "@essence-discord-bot/index";
import chalk from "chalk";
import { get } from "node:http";
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

export function botDebug(message: string) {
  console.debug(`${chalk.green("[Music module]")} ${chalk.blue(message)}`);
}

export const getBotChannelId = async (guildId: string) =>
  (await db.select(new RecordId("__module__music__music_channel_id", guildId)))
    ?.botChannelId as string | undefined;
export const getBotChannelEmbedId = async (channelId: string) =>
  (await db.select(new RecordId("__module__music_config", channelId)))
    ?.botChannelEmbedId as string | undefined;

export const getGuildIds = async () => {
  const dbGuildIds = await db.select("__module__music__music_channel_id");
  let guildIds: string[] = [];
  for (const dbGuildId of dbGuildIds) {
    const id = dbGuildId.id.id as string;
    guildIds.push(id);
  }
  return guildIds;
};

export const getChannelsIds = async () => {
  const records = await db.select("__module__music__music_channel_id");
  let channelIds: string[] = [];
  for (const record of records) {
    channelIds.push(record.botChannelId as string);
  }
  return channelIds;
};

export const getVolume = async (guildId: string) => {
  const volume = await db.select(
    new RecordId("__module__music__volume", guildId)
  );
  return volume?.volume as number | undefined;
};

export const getGuildIdsFromChannelIds = async (channelIds: string[]) => {
  const result = (
    await db.query(
      `SELECT * FROM __module__music__music_channel_id WHERE botChannelId IN ["${channelIds.join(
        `", "`
      )}"]`
    )
  )[0];
  return (result as any).map((record: any) => record.id.id) as string[];
};

export const setBotChannelId = async (channelId: string, guildId: string) => {
  const botChannelIdExists = await getBotChannelId(guildId);
  if (!botChannelIdExists) {
    await db.create(
      new RecordId("__module__music__music_channel_id", guildId),
      {
        botChannelId: channelId,
      }
    );
  }
  await db.update(new RecordId("__module__music__music_channel_id", guildId), {
    botChannelId: channelId,
  });
};

export const setBotChannelEmbedId = async (
  embedId: string,
  channelId: string
) => {
  const botChannelEmbedIdExists = await getBotChannelEmbedId(channelId);
  if (!botChannelEmbedIdExists) {
    await db.create(new RecordId("__module__music_config", channelId), {
      botChannelEmbedId: embedId,
    });
  }
  await db.update(new RecordId("__module__music_config", channelId), {
    botChannelEmbedId: embedId,
  });
};

export const setVolume = async (volume: number, guildId: string) => {
  const volumeExists = await getVolume(guildId);
  if (!volumeExists) {
    await db.create(new RecordId("__module__music__volume", guildId), {
      volume: volume,
    });
  }
  await db.update(new RecordId("__module__music__volume", guildId), {
    volume: volume,
  });
};
