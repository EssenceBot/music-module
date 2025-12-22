CREATE TABLE IF NOT EXISTS "guild_volume_settings" (
  "id" SERIAL PRIMARY KEY,
  "guild_id" VARCHAR(255) UNIQUE NOT NULL,
  "volume" INTEGER DEFAULT 100 NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_guild_volume_settings_guild_id" ON "guild_volume_settings" ("guild_id");
