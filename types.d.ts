import { type Client } from "discord.js";
import { type Manager } from "moonlink.js";

export interface MoonlinkClient extends Client {
  moonlink: Manager;
}

export type LavalinkNode = {
  host: string;
  port: number;
  password: string;
  secure: boolean;
};
