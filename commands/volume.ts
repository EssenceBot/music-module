import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { rainlink } from "..";
import { getVolume, setVolume } from "../lib";
import { updateEmbed } from "../embedManager";

export const volumeSlashCommandHandler = (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand
    .setName("volume")
    .setDescription("Set the volume of the player")
    .addIntegerOption((option) =>
      option.setName("volume").setDescription("Volume level").setRequired(false)
    );
};

export const volumeInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const volume = interaction.options.getInteger("volume");
  handleVolume(interaction, volume);
};

export const handleVolume = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
  volume: number | null
) => {
  const player = rainlink.players.get(interaction.guildId as string);
  const currentVolume = getVolume(interaction.guildId as string);

  if (!volume) {
    await interaction.reply({
      content: `Current volume is ${currentVolume}`,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  if (volume < 0 || volume > 100) {
    await interaction.reply({
      content: "Volume should be between 0 and 100",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  if (player) {
    player.setVolume(volume);
  }

  await setVolume(volume, interaction.guildId as string);
  updateEmbed(interaction.guildId as string);
  await interaction.reply({
    content: `Volume set to ${volume}`,
  });
  Bun.sleep(5000).then(() => interaction.deleteReply());
};
