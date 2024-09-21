import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { damonjs } from "..";
import type { LoopState } from "damonjs/dist/Modules/Interfaces";

export const loopSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
    slashCommand.setName('loop')
        .setDescription('Loops music')
        .addStringOption(option =>
                option.setName('mode')
                .setDescription('Loop mode')
                .addChoices(
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' },
                )
        )
}

export const loopInteractionHandler = async (interaction: CommandInteraction) => {
    const player = damonjs.getPlayer(interaction.guildId as string);
    if (!player) {
        await interaction.reply({ content: 'No player found', ephemeral: true });
        await Bun.sleep(5000).then(() => interaction.deleteReply());
        return;
    }
    const mode = interaction.options.get('mode')?.value as (string | undefined);
    if (mode === undefined) {
        const loop = player.loop
        if (loop === 'none') {
            player.setLoop('queue' as LoopState);
            await interaction.reply('Looping the queue');
            await Bun.sleep(3000).then(() => interaction.deleteReply());
        } else {
            player.setLoop('none' as LoopState);
            await interaction.reply('Stopped looping');
            await Bun.sleep(3000).then(() => interaction.deleteReply());
        }
    } else {
        player.setLoop(mode as LoopState);
        await interaction.reply(`Looping the ${mode}`);
        await Bun.sleep(3000).then(() => interaction.deleteReply());
    }
}