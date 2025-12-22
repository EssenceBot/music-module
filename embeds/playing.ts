import type { Locale } from "discord.js";
import { t } from "../lib/i18n";

export const playingEmbed = (
  locale: Locale | string,
  songTitle: string,
  songUrl: string,
  creatorName: string,
  thumbnailUrl: string,
  requesterId: string,
  songDuration: string,
  volume: number,
  queueLength: string,
  currentStatus: string,
  loop: string
) => {
  return {
    color: 16752324,
    title: t(locale, "embed.nowPlaying.title"),
    description: `[${t(locale, "embed.nowPlaying.description", { songTitle, creatorName })}](${songUrl})`,
    image: {
      url: thumbnailUrl,
    },
    fields: [
      {
        name: t(locale, "embed.nowPlaying.requestedBy"),
        value: `<@${requesterId}>`,
        inline: true,
      },
      {
        name: t(locale, "embed.nowPlaying.duration"),
        value: songDuration,
        inline: true,
      },
      {
        name: t(locale, "embed.nowPlaying.volume"),
        value: `${volume}%`,
        inline: true,
      },
      {
        name: t(locale, "embed.nowPlaying.queueLength"),
        value: queueLength,
        inline: true,
      },
      {
        name: t(locale, "embed.nowPlaying.loop"),
        value: loop,
        inline: true,
      },
      {
        name: t(locale, "embed.nowPlaying.status"),
        value: currentStatus,
        inline: true,
      },
    ],
  };
};