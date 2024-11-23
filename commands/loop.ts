import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  GuildMember,
} from "discord.js";
import { rainlink } from "..";
import { RainlinkLoopMode } from "rainlink";
import { updateEmbed } from "../embedManager";

export const loopSlashCommandHandler = async (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand
    .setName("loop")
    .setDescription("Loop the queue")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Loop mode")
        .setRequired(false)
        .addChoices(
          { name: "Queue", value: RainlinkLoopMode.QUEUE },
          { name: "Song", value: RainlinkLoopMode.SONG },
          { name: "None", value: RainlinkLoopMode.NONE }
        )
    );
};

export const loopInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const mode = interaction.options.getString("mode") as RainlinkLoopMode;
  loopHandler(interaction, mode);
};

export const loopHandler = async (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
  mode: RainlinkLoopMode
) => {
  const voiceChannel = (interaction.member as GuildMember)?.voice.channel;
  if (!voiceChannel) {
    await interaction.reply({
      content: "You need to be in a voice channel",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  const player = rainlink.players.get(interaction.guildId as string);
  if (!player) {
    await interaction.reply({
      content: "There is no player on current server",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  if (voiceChannel.id !== player.voiceId) {
    await interaction.reply({
      content: "You need to be in the same voice channel as the bot",
      ephemeral: true,
    });
    Bun.sleep(5000).then(() => interaction.deleteReply());
    return;
  }
  if (!mode) {
    const currentMode = player.loop;
    if (currentMode === RainlinkLoopMode.NONE) {
      player.setLoop(RainlinkLoopMode.SONG);
      await interaction.reply({
        content: "Looping song",
      });
      Bun.sleep(5000).then(() => interaction.deleteReply());
      return;
    }
    if (currentMode === RainlinkLoopMode.SONG) {
      player.setLoop(RainlinkLoopMode.NONE);
      await interaction.reply({
        content: "Disabled loop",
      });
      Bun.sleep(5000).then(() => interaction.deleteReply());
      return;
    }
    return;
  }
  player.setLoop(mode);
  updateEmbed(interaction.guildId as string);
  let modeMessage = "";
  switch (mode) {
    case RainlinkLoopMode.QUEUE:
      modeMessage = "Looping queue";
      break;
    case RainlinkLoopMode.SONG:
      modeMessage = "Looping song";
      break;
    case RainlinkLoopMode.NONE:
      modeMessage = "Disabled loop";
      break;
  }
  await interaction.reply({
    content: modeMessage,
  });
  Bun.sleep(5000).then(() => interaction.deleteReply());
};
