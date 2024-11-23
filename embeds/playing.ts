export const playingEmbed = (
  songTitle: string,
  songUrl: string,
  creatorName: string,
  thumbnailUrl: string,
  requesterId: string,
  songDuration: string,
  volume: number,
  queueLength: number,
  currentStatus: string,
  loop: string
) => {
  return {
    color: 16752324,
    title: "Now Playing",
    description: `[${songTitle}](${songUrl}) by ${creatorName}`,
    image: {
      url: thumbnailUrl,
    },
    fields: [
      {
        name: "Requested by",
        value: `<@${requesterId}>`,
        inline: true,
      },
      {
        name: "Duration",
        value: songDuration,
        inline: true,
      },
      {
        name: "Volume",
        value: `${volume}%`,
        inline: true,
      },
      {
        name: "Songs in queue",
        value: queueLength,
        inline: true,
      },
      {
        name: "Loop",
        value: loop,
        inline: true,
      },
      {
        name: "Status",
        value: currentStatus,
        inline: true,
      },
    ],
  };
};
