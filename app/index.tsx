import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemonsInfinite } from "@/hooks/use-pokemons";
import { Pokemon } from "@/services/pokeapi";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PokemonListItem({ pokemon }: { pokemon: Pokemon }) {
  const router = useRouter();

  function navigateToDetails(id: number) {
    router.navigate(`/pokemon/${id}`);
  }

  return (
    <TouchableOpacity
      onPress={() => navigateToDetails(pokemon.id)}
      style={styles.touchableListItem}
      activeOpacity={0.3}
    >
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PokemonImage
          imagePath={pokemon.sprites.front_default}
          imageHeight={100}
          imageWidth={100}
          style={{ flex: 0, minWidth: 110 }}
        />
        <ThemedText type="default" style={styles.pokemonNumber}>
          #{pokemon.id}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={{ flex: 1, flexWrap: "wrap" }}
        >
          {capitalize(pokemon.name)}
        </ThemedText>
        <ThemedView style={styles.badgeContainer}>
          {pokemon.types.map((type) => (
            <ThemedTypeBadge
              key={type.type.name}
              pokemonType={type.type.name as any}
            />
          ))}
        </ThemedView>
        <ThemedText style={styles.chevronRight}>❯</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

export function renderSeparator() {
  return <ThemedView style={styles.separator} />;
}

export default function PokemonListScreen() {
  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    usePokemonsInfinite(20, 60);
  const pokemons = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  if (isLoading) return <ThemedText type="title">Loading...</ThemedText>;
  if (error)
    return <ThemedText type="title">Error: {error.message}</ThemedText>;

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={pokemons}
        ItemSeparatorComponent={renderSeparator}
        renderItem={(item) => <PokemonListItem pokemon={item.item} />}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginLeft: 120,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  touchableListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  pokemonNumber: {
    flex: 0,
    width: 45,
    textAlign: "right",
    marginRight: 10,
  },
  badgeContainer: {
    flexDirection: "column",
    flex: 0,
    marginRight: 10,
    gap: 5,
  },
  chevronRight: {
    marginLeft: 5,
    color: "rgba(0,0,0,0.5)",
  },
});
