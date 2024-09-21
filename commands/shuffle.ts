import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { damonjs } from "..";

export const shuffleSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('shuffle')
        .setDescription('Shuffles queue')
}

export const shuffleInteractionHandler = async (interaction: CommandInteraction) => {
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
    player.queue.shuffle();
    await interaction.reply('Shuffled the queue');
    await Bun.sleep(3000).then(() => interaction.deleteReply());
}