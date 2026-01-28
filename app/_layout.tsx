import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import migrations from "@/services/drizzle/migrations";
import { db, fillDatabase } from "@/services/pokomon-db";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const migrationsResult = useMigrations(db, migrations as any);

  useEffect(() => {
    if (migrationsResult.success) {
      fillDatabase();
      console.log("Migrations successful");
    } else {
      console.log("Migrations failed", migrationsResult.error, migrations);
    }
  }, [migrationsResult]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
  );
}
