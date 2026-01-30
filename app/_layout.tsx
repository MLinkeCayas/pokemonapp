import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "/",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SQLiteProvider databaseName="pokemon.db" onInit={migrateDbIfNeeded}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" />
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
            edges={["top", "bottom"]}
          >
            <Stack>
              <Stack.Screen name="index" options={{ title: "All Pokemons" }} />
              <Stack.Screen
                name="pokemon/[id]"
                options={{ title: "Pokemon Detail" }}
              />
            </Stack>
          </SafeAreaView>
        </ThemeProvider>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      -- Main Pokemon table
      CREATE TABLE pokemons (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        sprite_back_default TEXT,
        sprite_back_female TEXT,
        sprite_back_shiny TEXT,
        sprite_back_shiny_female TEXT,
        sprite_front_default TEXT,
        sprite_front_female TEXT,
        sprite_front_shiny TEXT,
        sprite_front_shiny_female TEXT,
        sprite_front_animated TEXT
      );

      -- Pokemon types (e.g., grass, fire, water)
      CREATE TABLE pokemon_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pokemon_id INTEGER NOT NULL,
        slot INTEGER NOT NULL,
        type_name TEXT NOT NULL,
        FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE
      );

      -- Pokemon stats (hp, attack, defense, etc.)
      CREATE TABLE pokemon_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pokemon_id INTEGER NOT NULL,
        stat_name TEXT NOT NULL,
        base_stat INTEGER NOT NULL,
        FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE
      );

      -- Caught Pokemon collection
      CREATE TABLE caught_pokemons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pokemon_id INTEGER NOT NULL,
        nickname TEXT,
        caught_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE
      );

      -- Indexes for faster lookups
      CREATE INDEX idx_pokemon_types_pokemon_id ON pokemon_types(pokemon_id);
      CREATE INDEX idx_pokemon_stats_pokemon_id ON pokemon_stats(pokemon_id);
      CREATE INDEX idx_caught_pokemons_pokemon_id ON caught_pokemons(pokemon_id);
    `);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
