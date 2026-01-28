import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("pokemon", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  order: int().notNull(),
  sprites: text().notNull(),
  types: text().notNull(),
  stats: text().notNull(),
});
