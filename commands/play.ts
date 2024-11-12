import {
  ChannelType,
  type CommandInteraction,
  type GuildMember,
  type SlashCommandBuilder,
} from "discord.js";

import { rainlink } from "..";

export const playSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
  slashCommand
    .setName("play")
    .setDescription("Add a track to queue and play it")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query or URL")
        .setRequired(true)
    );
};

export const playInteractionHandler = async (
  interaction: CommandInteraction
) => {
  const query = interaction.options.get("query")?.value as string;
  console.log(`Query: ${query}`);
  if (interaction.channel?.type === ChannelType.GuildText) {
    const voiceChannel = (interaction.member as GuildMember)?.voice.channel;
    console.log(`Voice channel: ${voiceChannel}`);
    if (voiceChannel) {
      const player = await rainlink.create({
        guildId: interaction.guildId as string,
        textId: interaction.channel?.id,
        voiceId: voiceChannel.id,
        shardId: interaction.guild?.shardId as number,
        volume: 40,
      });
      const result = await rainlink.search(query, {
        requester: interaction.user,
      });
      if (!result.tracks.length) {
        console.log("No tracks found");
        await interaction.reply({
          content: "No tracks found",
          ephemeral: true,
        });
        await Bun.sleep(5000).then(() => interaction.deleteReply());
        return;
      }
      if (result.type === "PLAYLIST")
        for (let track of result.tracks) player.queue.add(track);
      else player.queue.add(result.tracks[0]);

      if (!player.playing || !player.paused) player.play();
      console.log(
        `Queued ${result.type === "PLAYLIST" ? result.tracks.length : 1} tracks`
      );
      await interaction.reply({
        content:
          result.type === "PLAYLIST"
            ? `Queued ${result.tracks.length} from ${result.playlistName}`
            : `Queued ${result.tracks[0].title}`,
      });
      await Bun.sleep(3000).then(() => interaction.deleteReply());
      return;
    } else {
      console.log("User is not in a voice channel");
      await interaction.reply({
        content: "You need to be in a voice channel",
        ephemeral: true,
      });
      await Bun.sleep(5000).then(() => interaction.deleteReply());
    }
  } else {
    await interaction.reply({
      content: "This command can only be used in a server",
      ephemeral: true,
    });
    await Bun.sleep(5000).then(() => interaction.deleteReply());
  }
};
