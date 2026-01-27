import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonListScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="title">Pokemon List</ThemedText>

        <Link href="/pokemon/1">Pokemon 1</Link>
      </ThemedView>
    </SafeAreaView>
  );
}
