import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemons } from "@/hooks/use-pokemons";
import { Link } from "expo-router";
import { ScrollView } from "react-native";

export default function PokemonListScreen() {
  const { data, isLoading, error } = usePokemons(100, 0);

  if (isLoading) return <ThemedText type="title">Loading...</ThemedText>;
  if (error)
    return <ThemedText type="title">Error: {error.message}</ThemedText>;

  return (
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
              <ThemedText
                type="default"
                style={{
                  flex: 0,
                  width: 45,
                  textAlign: "right",
                  marginRight: 10,
                }}
              >
                #{pokemon.order}
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{ flex: 1, flexWrap: "wrap" }}
              >
                {pokemon.name}
              </ThemedText>
              <ThemedView
                style={{
                  flexDirection: "column",
                  flex: 0,
                  marginRight: 10,
                  gap: 5,
                }}
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
  );
}
