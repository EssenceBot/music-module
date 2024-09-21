import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { damonjs } from "..";

export const skipSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('skip')
        .setDescription('Skip one track in queue')
}

export const skipInteractionHandler = async (interaction: CommandInteraction) => {
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
    await player.skip();
    await interaction.reply('Skipped the current track');
    await Bun.sleep(3000).then(() => interaction.deleteReply());
    if (player.queue.size === 0) {
        const message = player.data.get('message');
        message && (await message.edit({ content: `Destroyed player due to inactivity.` }));
        player.destroy();
        await Bun.sleep(3000).then(() => message?.delete());
    }
}