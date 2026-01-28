import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

const expo = SQLite.openDatabaseSync("pokemon.db");
export const db = drizzle(expo);
