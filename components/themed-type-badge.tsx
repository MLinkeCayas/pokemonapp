import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dark"
  | "dragon"
  | "steel"
  | "fairy";

const pokemonTypeColors: Record<PokemonType, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  grass: "#7AC74C",
  electric: "#F7D02C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dark: "#705746",
  dragon: "#6F35FC",
  steel: "#B7B7CE",
  fairy: "#D685AD",
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
    <ThemedView
      style={styles.badge}
      lightColor={typeColor}
      darkColor={typeColor}
    >
      <ThemedText style={styles.badgeText}>{pokemonType}</ThemedText>
    </ThemedView>
  );
}

function getTypeColor(pokemonType: PokemonType): string {
  return pokemonTypeColors[pokemonType];
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
