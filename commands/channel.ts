import {
  ChannelType,
  type SlashCommandSubcommandBuilder,
  type SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Message,
  type GuildMember,
  type TextChannel,
} from "discord.js";
import {
  createChannelMessageListener,
  removeChannelMessageListener,
} from "@essence-discord-bot/api/botExtension";
import { handlePlay } from "./play";
import { getGuildIds, setBotChannelEmbedId, setBotChannelId } from "../lib";
import { waitingEmbed } from "../embeds/waiting";

export const createChannelMessageListenerFromId = (channelId: string) => {
  createChannelMessageListener(channelId, channelMessageHandler);
};

const channelMessageHandler = async (message: Message) => {
  if (message.author.bot) return;
  Bun.sleep(3000).then(() => message.delete());
  await handlePlay(
    message.guildId as string,
    message.channelId as string,
    message.guild?.shardId as number,
    message.author,
    message.member as GuildMember,
    message.content
  );
};

export const channelSlashCommandHandler = (
  slashCommand: SlashCommandBuilder
) => {
  slashCommand
    .setName("bot-channel")
    .setDescription(
      "Sets the channel for the bot to listen for commands and to update status"
    )
    .addSubcommandGroup((subcommandGroup) => {
      subcommandGroup
        .setName("create")
        .setDescription("Create a new bot channel")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
          subcommand
            .setName("name")
            .setDescription("Name of the new bot channel")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("Name of the new bot channel")
            )
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
          subcommand
            .setName("id")
            .setDescription("ID of the existing channel to set as bot channel")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription(
                  "ID of the existing channel to set as bot channel"
                )
            )
        );
      return subcommandGroup;
    });
};

export const channelInteractionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  if (interaction.channel?.type === ChannelType.GuildText) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    switch (subcommandGroup) {
      case "create":
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === "name") {
          await handleCreateNameSubcommand(interaction);
        } else if (subcommand === "id") {
          await handleCreateIdSubcommand(interaction);
        }
        break;
    }
  }
};
const handleCreateNameSubcommand = async (
  interaction: ChatInputCommandInteraction
) => {
  const name = interaction.options.getString("name");
  if (!name) {
    await interaction.reply({
      content: "Name is required",
      ephemeral: true,
    });
    return;
  }
  if ((await getGuildIds()).includes(interaction.guildId as string)) {
    removeChannelMessageListener(
      interaction.guildId as string,
      channelMessageHandler
    );
  }
  const channel = await interaction.guild?.channels.create({
    name,
    type: ChannelType.GuildText,
  });
  if (!channel) {
    await interaction.reply({
      content: "Failed to create channel",
      ephemeral: true,
    });
    return;
  }
  setBotChannelId(channel.id, interaction.guildId as string);
  createChannelMessageListenerFromId(channel.id);
  const embedMessage = await channel.send({
    embeds: [await waitingEmbed(interaction.guildId as string)],
  });
  setBotChannelEmbedId(embedMessage.id, channel.id);
  await interaction.reply({
    content: `Bot channel created: ${channel.name}`,
    ephemeral: true,
  });
};

const handleCreateIdSubcommand = async (
  interaction: ChatInputCommandInteraction
) => {
  const id = interaction.options.getString("id");
  if (!id) {
    await interaction.reply({
      content: "ID is required",
      ephemeral: true,
    });
    return;
  }
  const channel = interaction.guild?.channels.cache.get(id);
  if (!channel) {
    await interaction.reply({
      content: "Channel not found",
      ephemeral: true,
    });
    return;
  }
  if ((await getGuildIds()).includes(interaction.guildId as string)) {
    removeChannelMessageListener(
      interaction.guildId as string,
      channelMessageHandler
    );
  }
  setBotChannelId(channel.id, interaction.guildId as string);
  createChannelMessageListenerFromId(channel.id);
  const embedMessage = await (channel as TextChannel).send({
    embeds: [await waitingEmbed(interaction.guildId as string)],
  });
  setBotChannelEmbedId(embedMessage.id, channel.id);
  await interaction.reply({
    content: `Bot channel set to: ${channel.name}`,
    ephemeral: true,
  });
};
