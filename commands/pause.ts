import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { damonjs } from "..";

export const pauseSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('pause')
        .setDescription('Pause music')
}

export const pauseInteractionHandler = async (interaction: CommandInteraction) => {
    const player = damonjs.getPlayer(interaction.guildId as string);
    if (!player) {
        await interaction.reply({ content: 'No player found', ephemeral: true });
        await Bun.sleep(5000).then(() => interaction.deleteReply());
        return;
    }
    if (!player.queue.current) {
        await interaction.reply({ content: 'No track found', ephemeral: true });
        await Bun.sleep(5000).then(() => interaction.deleteReply());
        return;
    }
    const paused = player.paused;
    await player.pause(!paused);
    if (paused) {
        await interaction.reply('Resumed the current track');
        await Bun.sleep(3000).then(() => interaction.deleteReply());
    } else {
        await interaction.reply('Paused the current track');
        await Bun.sleep(3000).then(() => interaction.deleteReply());
    }
}