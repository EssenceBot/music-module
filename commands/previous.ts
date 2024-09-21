import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { damonjs } from "..";

export const previousSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('previous')
        .setDescription('Previous track in queue')
}

export const previousInteractionHandler = async (interaction: CommandInteraction) => {
    const player = damonjs.getPlayer(interaction.guildId as string);
    if (!player) {
        await interaction.reply({ content: 'No player found', ephemeral: true });
        await Bun.sleep(5000).then(() => interaction.deleteReply());
        return;
    }
    await player.previous();
    await interaction.reply('Playing the previous track');
    await Bun.sleep(3000).then(() => interaction.deleteReply());
}