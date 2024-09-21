import { Events, DamonJs, Plugins } from "damonjs";
import { Shoukaku, Connectors } from 'shoukaku';
import { createSlashCommand, getClient } from "@essence-discord-bot/api/botExtension";

import { playSlashCommandHandler, playInteractionHandler } from "./commands/play";
import { skipSlashCommandHandler, skipInteractionHandler } from "./commands/skip";
import { previousSlashCommandHandler, previousInteractionHandler } from "./commands/previous";
import { pauseSlashCommandHandler, pauseInteractionHandler } from "./commands/pause";
import { loopSlashCommandHandler, loopInteractionHandler } from "./commands/loop";
import { shuffleInteractionHandler, shuffleSlashCommandHandler } from "./commands/shuffle";
import { clearInteractionHandler, clearSlashCommandHandler } from "./commands/clear";
 


const client = getClient();

if (!process.env.LAVALINK_HOST) throw new Error("LAVALINK_HOST is not defined")
    if (process.env.LAVALINK_SECURE === undefined) process.env.LAVALINK_SECURE = "false"
    if (process.env.LAVALINK_SECURE !== "true" && process.env.LAVALINK_SECURE !== "false") throw new Error("LAVALINK_SECURE has wrong value")

    const Nodes = [
        {
            name: process.env.LAVALINK_NAME || 'default',
            url: `${process.env.LAVALINK_HOST as string}:${process.env.LAVALINK_PORT || 2333}`,
            auth: process.env.LAVALINK_PASSWORD || '',
            secure: process.env.LAVALINK_SECURE as unknown as boolean,
        },
    ];

export const damonjs = new DamonJs({
    resolveError: {
        max: 5,
        time: 30 * 1000,
    },
    exceptions: {
        max: 5,
        time: 30 * 1000,
    },
    stuck: {
        max: 5,
        time: 30 * 1000,
    },
    skipResolveError: true,
    skipOnException: true,
    skipOnStuck: true,
    defaultSearchEngine: 'spotify',
    defaultYoutubeThumbnail: 'default',

    plugins: [new Plugins.PlayerMoved(client)],
},
new Shoukaku(new Connectors.DiscordJS(client), Nodes, {
    moveOnDisconnect: false,
    resume: false,
    resumeTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000,
}),
);

export function discordBotInit() {
    damonjs.shoukaku.on('ready', (name) => console.log(`[Music module] Lavalink ${name}: Ready!`));
    damonjs.shoukaku.on('error', (name, error) => console.error(`[Music module] Lavalink ${name}: Error Caught,`, error));
    damonjs.shoukaku.on('close', (name, code, reason) =>
        console.warn(`[Music module] Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`),
    );

    damonjs.on(Events.PlayerCreate, async (player) => {
        const channel = client.channels.cache.get(player.textId) || (await client.channels.fetch(player.textId).catch(() => null));
        if (channel && channel.isTextBased()) {
            const message = await channel.send({ content: 'Created a player' });
            player.data.set('message', message);
        }
    });
    damonjs.on(Events.PlayerStart, async (player, track) => {
        const message = player.data.get('message');
        message && (await message.edit({ content: `Started playing ${track.title}` }));
    });
    damonjs.on(Events.PlayerEnd, async (player) => {
        const message = player.data.get('message');
        message && (await message.edit({ content: `Finished playing` }));
    });

    damonjs.on(Events.PlayerEmpty, async (player) => {
        const message = player.data.get('message');
        message && (await message.edit({ content: `Destroyed player due to inactivity.` }));
        player.destroy();
        await Bun.sleep(3000).then(() => message?.delete());
    });
    
    createSlashCommand(playSlashCommandHandler, playInteractionHandler)
    createSlashCommand(skipSlashCommandHandler, skipInteractionHandler);
    createSlashCommand(previousSlashCommandHandler, previousInteractionHandler);
    createSlashCommand(pauseSlashCommandHandler, pauseInteractionHandler);
    createSlashCommand(loopSlashCommandHandler, loopInteractionHandler);
    createSlashCommand(shuffleSlashCommandHandler, shuffleInteractionHandler)
    createSlashCommand(clearSlashCommandHandler, clearInteractionHandler);
    console.log('[Music module] Registered 7 slash commands: [play, skip, previous, pause, loop, shuffle, clear]')
}