import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/hooks/use-pokemons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isLoading, error } = usePokemon(+id);

  useEffect(() => {
    // Set the title dynamically based on the Pokemon ID
    navigation.setOptions({
      title: `Pokemon ${data?.name as string}`,
    });
  }, [id, navigation]);

  if (isLoading) return <ThemedText type="title">Loading...</ThemedText>;

  if (error)
    return <ThemedText type="title">Error: {error.message}</ThemedText>;

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <PokemonImage
        imagePath={data?.sprites.front_default as string}
        imageHeight={200}
        imageWidth={200}
        style={{ flex: 0, minWidth: 110 }}
      />

      <ThemedText type="title">
        # {data?.id} {data?.name}
      </ThemedText>

      <ThemedView
        style={{
          flexDirection: "row",
          flex: 0,
          gap: 5,
        }}
      >
        {data?.types.map((type) => (
          <ThemedTypeBadge
            key={type.type.name}
            pokemonType={type.type.name as any}
          />
        ))}
      </ThemedView>

      <ThemedText type="title">Stats</ThemedText>

      <ThemedView
        style={{
          flexDirection: "column",
          flex: 0,
          marginRight: 10,
          gap: 5,
        }}
      >
        {data?.stats.map((stat) => (
          <ThemedText key={stat.stat.name}>
            {stat.stat.name} {stat.base_stat}
          </ThemedText>
        ))}
      </ThemedView>
    </ThemedView>
  );
}
