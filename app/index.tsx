import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemons } from "@/hooks/use-pokemons";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonListScreen() {
  const { data, isLoading, error } = usePokemons(50, 0);

  if (isLoading) return <ThemedText type="title">Loading...</ThemedText>;
  if (error)
    return <ThemedText type="title">Error: {error.message}</ThemedText>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {data?.map((pokemon) => (
            <Link
              href={`/pokemon/${pokemon.id}`}
              key={pokemon.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                flex: 1,
              }}
            >
              <ThemedView
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <PokemonImage
                  imagePath={pokemon.sprites.front_default}
                  imageHeight={100}
                  imageWidth={100}
                  style={{ flex: 0, minWidth: 110, marginRight: 10 }}
                />
                <ThemedText type="title" style={{ flex: 1 }}>
                  {pokemon.name}
                </ThemedText>
                <ThemedView
                  style={{ flexDirection: "column", flex: 0, marginRight: 10 }}
                >
                  {pokemon.types.map((type) => (
                    <ThemedTypeBadge
                      key={type.type.name}
                      pokemonType={type.type.name as any}
                    />
                  ))}
                </ThemedView>
              </ThemedView>
            </Link>
          ))}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
