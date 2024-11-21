import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";

export const previousSlashCommandHandler = (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("previous").setDescription("Previous track in queue");
};

export const previousInteractionHandler = async (
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
  const previousSong = player.getPrevious();
  if (!previousSong) {
    await interaction.reply({
      content: "There is no previous song",
      ephemeral: true,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
    return;
  }
  await player.previous();
};
