import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pokemonTable = sqliteTable("pokemon", {
  id: int().primaryKey(),
  name: text().notNull(),
  order: int().notNull(),
  sprites: text().notNull(),
  types: text().notNull(),
  stats: text().notNull(),
});

export const appStateTable = sqliteTable("app_state", {
  key: text().primaryKey(),
  value: text().notNull(),
});
