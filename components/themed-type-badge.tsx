import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type PokemonTypeName =
  | "Normal"
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dark"
  | "Dragon"
  | "Steel"
  | "Fairy";

export type PokemonType = {
  id: number;
  name: PokemonTypeName;
};

const pokemonTypeColors: Record<PokemonTypeName, string> = {
  Normal: "#A8A77A",
  Fire: "#EE8130",
  Water: "#6390F0",
  Grass: "#7AC74C",
  Electric: "#F7D02C",
  Ice: "#96D9D6",
  Fighting: "#C22E28",
  Poison: "#A33EA1",
  Ground: "#E2BF65",
  Flying: "#A98FF3",
  Psychic: "#F95587",
  Bug: "#A6B91A",
  Rock: "#B6A136",
  Ghost: "#735797",
  Dark: "#705746",
  Dragon: "#6F35FC",
  Steel: "#B7B7CE",
  Fairy: "#D685AD",
};

export type ThemedTypeBadgeProps = {
  lightColor?: string;
  darkColor?: string;
  pokemonType: PokemonType;
};

export function ThemedTypeBadge({
  lightColor,
  darkColor,
  pokemonType,
}: ThemedTypeBadgeProps) {
  const typeColor = getTypeColor(pokemonType);

  return (
    <SafeAreaView style={styles.page}>
      <ThemedView
        style={styles.badge}
        lightColor={typeColor}
        darkColor={typeColor}
      >
        <ThemedText style={styles.badgeText}>{pokemonType.name}</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

function getTypeColor(pokemonType: PokemonType): string {
  return pokemonTypeColors[pokemonType.name];
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  badge: { width: 80, borderRadius: 10 },
  badgeText: {
    alignSelf: "center",
  },
});
