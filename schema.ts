import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const guildVolumeSettings = pgTable("guild_volume_settings", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 255 }).unique().notNull(),
  volume: integer("volume").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
