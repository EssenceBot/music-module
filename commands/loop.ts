import type {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { rainlink } from "..";
import { RainlinkLoopMode } from "rainlink";

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
  const player = rainlink.players.get(interaction.guildId as string);
  if (!player) {
    await interaction.reply({
      content: "There is no player on current server",
      ephemeral: true,
    });
    Bun.sleep(3000).then(() => interaction.deleteReply());
    return;
  }
  const mode = interaction.options.getString("mode") as RainlinkLoopMode;
  if (!mode) {
    const currentMode = player.loop;
    if (currentMode === RainlinkLoopMode.NONE) {
      player.setLoop(RainlinkLoopMode.SONG);
      await interaction.reply({
        content: "Looping song",
      });
      Bun.sleep(3000).then(() => interaction.deleteReply());
      return;
    }
    if (currentMode === RainlinkLoopMode.SONG) {
      player.setLoop(RainlinkLoopMode.NONE);
      await interaction.reply({
        content: "Disabled loop",
      });
      Bun.sleep(3000).then(() => interaction.deleteReply());
      return;
    }
    return;
  }
  player.setLoop(mode);
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
  Bun.sleep(3000).then(() => interaction.deleteReply());
};
