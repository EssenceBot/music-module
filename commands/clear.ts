import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { damonjs } from "..";

export const clearSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('clear')
        .setDescription('Clears queue')
}

export const clearInteractionHandler = async (interaction: CommandInteraction) => {
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
    player.queue.clear();
    await interaction.reply('Cleared the queue');
    await Bun.sleep(3000).then(() => interaction.deleteReply());
}