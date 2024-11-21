import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

// it will send <:out:1308188934018437221> to the channel
export const emojiSlashCommandHandler = async (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand.setName("emoji").setDescription("Send an emoji to the channel");
};

export const emojiInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  await interaction.reply(`<a:out:1308188934018437221>`);
};
