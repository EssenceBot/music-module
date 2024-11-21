import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { rainlink } from "..";

export const shuffleSlashCommandHandler = (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("shuffle").setDescription("Shuffle the queue");
};

export const shuffleInteractionHandler = async (
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
  player.queue.shuffle();
  await interaction.reply({
    content: "Queue shuffled",
  });
  Bun.sleep(3000).then(() => interaction.deleteReply());
};
