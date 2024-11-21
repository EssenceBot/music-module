import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";

export const clearSlashCommandHandler = (slashCommand: SlashCommandBuilder) => {
  slashCommand.setName("clear").setDescription("Clear the queue");
};

export const clearInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const player = rainlink.players.get(interaction.guildId as string);
  if (!player) {
    await interaction.reply({
      content: "There is no player on current server",
      ephemeral: true,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
    return;
  }
  player.queue.clear();
  await interaction.reply({
    content: "Queue cleared",
  });
  Bun.sleep(3000).then(() => interaction.deleteReply());
};
