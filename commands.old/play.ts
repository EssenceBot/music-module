import { SearchResultTypes } from "damonjs/dist/Modules/Interfaces";
import { ChannelType, type CommandInteraction, type GuildMember, type SlashCommandBuilder } from "discord.js";

import { damonjs } from ".."

export const playSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('play')
        .setDescription('Add a track to queue and play it')
        .addStringOption(option => option.setName('query').setDescription('Search query or URL').setRequired(true))
};

export const playInteractionHandler = async (interaction: CommandInteraction) => {
    const query = interaction.options.get('query')?.value as string;
    if (interaction.channel?.type === ChannelType.GuildText) {
        const voiceChannel = (interaction.member as GuildMember)?.voice.channel;
        if (voiceChannel) {
            const player = await damonjs.createPlayer({
                guildId: interaction.guildId as string,
                textId: interaction.channel?.id,
                voiceId: voiceChannel.id,
                volume: 40,
                shardId: interaction.guild?.shardId,
            });
            const result = await player.search(query, { requester: interaction.user });
            if (!result.tracks.length) {
                await interaction.reply({ content: 'No tracks found', ephemeral: true });
                await Bun.sleep(5000).then(() => interaction.deleteReply());
                return;
            }
            if (result.type === SearchResultTypes.Playlist) player.queue.add(result.tracks);
            else player.queue.add(result.tracks[0]);

            if (!player.playable) await player.play(); // only use player.playable to play because if you use player.playing you can get unexpected bugs
            if (player.paused) await player.pause(!player.paused); // if player is paused its gonna play
            await interaction.reply(`Queued ${result.tracks[0].title}`);
            await Bun.sleep(3000).then(() => interaction.deleteReply());
            return;
        } else {
            await interaction.reply({ content: 'You need to be in a voice channel', ephemeral: true });
            await Bun.sleep(5000).then(() => interaction.deleteReply());
        }
    } else {
        await interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });
        await Bun.sleep(5000).then(() => interaction.deleteReply());
    }
};   