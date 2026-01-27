import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    // Set the title dynamically based on the Pokemon ID
    navigation.setOptions({
      title: `Pokemon #${id}`,
    });
  }, [id, navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="title">Detail of Pokemon {id}</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
