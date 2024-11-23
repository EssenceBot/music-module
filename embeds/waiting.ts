export const waitingEmbed = (volume: number, loop: string) => {
  return {
    color: 16752324,
    title: "Waiting for something to play",
    description:
      "To play something send link or name to this channel or use `/play`",
    image: {
      url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5c60f840-691b-4fcf-83a4-55ec348ca9bf/di6ip78-a257e921-f3cd-4a0a-b4c6-e9cbb74b4987.png/v1/fill/w_894,h_894,q_70,strp/snorlax__the_sleeping_pokemon_by_huxianshi_di6ip78-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzVjNjBmODQwLTY5MWItNGZjZi04M2E0LTU1ZWMzNDhjYTliZlwvZGk2aXA3OC1hMjU3ZTkyMS1mM2NkLTRhMGEtYjRjNi1lOWNiYjc0YjQ5ODcucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.S3pHMHrqRszHg_O4XXZmz3ZVXA8nrWLMm4feJlAxkFs",
    },
    fields: [
      {
        name: "Volume",
        value: `${volume}%`,
        inline: true,
      },
      {
        name: "** **",
        value: "** **",
        inline: true,
      },
      {
        name: "Loop",
        value: loop,
        inline: true,
      },
    ],
  };
};
