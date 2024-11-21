import {
  ChannelType,
  type SlashCommandSubcommandBuilder,
  type SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Message,
  type GuildMember,
  type TextChannel,
} from "discord.js";
import { RecordId } from "surrealdb";
import { bot, db } from "@essence-discord-bot/index.ts";
import { createChannelMessageListener } from "@essence-discord-bot/api/botExtension";
import { handlePlay } from "./play";
import { defaultEmbed } from "..";
import {
  getBotChannelEmbedId,
  getBotChannelId,
  setBotChannelEmbedId,
  setBotChannelId,
} from "../lib";

const botChannelId = await getBotChannelId();
const botChannelEmbedId = await getBotChannelEmbedId();

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

const createChannelMessageListenerFromId = (channelId: string) => {
  console.log(`Creating channel message listener for channel: ${channelId}`);
  createChannelMessageListener(channelId, channelMessageHandler);
};

if (botChannelId) {
  if (!botChannelEmbedId) {
    (async () => {
      const channel = (await bot.channels.fetch(botChannelId)) as TextChannel;
      const embedMessage = await channel.send({
        embeds: [defaultEmbed],
      });
      await db.create(
        new RecordId("__module__music_config", "botChannelEmbedId"),
        {
          botChannelEmbedId: embedMessage.id,
        }
      );
      setBotChannelEmbedId(embedMessage.id);
    })();
  }
  createChannelMessageListenerFromId(botChannelId);
}

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
        createChannelMessageListenerFromId(botChannelId as string);
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
  if (botChannelId !== undefined) {
    setBotChannelId(channel.id);
  } else {
    await db.create(new RecordId("__module__music_config", "botChannelId"), {
      botChannelId: channel.id,
    });
    setBotChannelId(channel.id);
  }
  const embedMessage = await channel.send({
    embeds: [defaultEmbed],
  });
  if (botChannelEmbedId !== undefined) {
    setBotChannelEmbedId(embedMessage.id);
  } else {
    await db.create(
      new RecordId("__module__music_config", "botChannelEmbedId"),
      {
        botChannelEmbedId: embedMessage.id,
      }
    );
    setBotChannelEmbedId(embedMessage.id);
  }
  await interaction.reply({
    content: `Bot channel created: ${channel}`,
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
  if (botChannelId !== undefined) {
    setBotChannelId(channel.id);
  } else {
    await db.create(new RecordId("__module__music_config", "botChannelId"), {
      botChannelId: channel.id,
    });
    setBotChannelId(channel.id);
  }

  const embedMessage = await (channel as TextChannel).send({
    embeds: [defaultEmbed],
  });
  if (botChannelEmbedId !== undefined) {
    setBotChannelEmbedId(embedMessage.id);
  } else {
    await db.create(
      new RecordId("__module__music_config", "botChannelEmbedId"),
      {
        botChannelEmbedId: embedMessage.id,
      }
    );
    setBotChannelEmbedId(embedMessage.id);
  }
  await interaction.reply({
    content: `Bot channel set to: ${channel}`,
    ephemeral: true,
  });
};
