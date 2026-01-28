import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
