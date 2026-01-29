import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/hooks/use-pokemons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isLoading, error } = usePokemon(parseInt(id, 10));

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // Set the title dynamically based on the Pokemon ID
    if (data?.name) {
      navigation.setOptions({
        title: `Pokemon ${data?.name.toUpperCase() as string}`,
      });

      fadeIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.name, navigation]);

  if (isLoading) return <ThemedText type="title">Loading...</ThemedText>;

  if (error)
    return <ThemedText type="title">Error: {error.message}</ThemedText>;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <ThemedView style={styles.centeredSection}>
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <PokemonImage
              imagePath={data?.sprites.front_animated as string}
              imageHeight={200}
              imageWidth={200}
              style={styles.pokemonImage}
            />
          </Animated.View>

          <ThemedText type="title" style={styles.pokemonName}>
            # {data?.id} {data?.name?.toUpperCase()}
          </ThemedText>

          <ThemedView style={styles.typeBadgesContainer}>
            {data?.types.map((type) => (
              <ThemedTypeBadge
                key={type.type.name}
                pokemonType={type.type.name as any}
              />
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.statsSection}>
          <ThemedText type="title" style={styles.statsHeader}>
            Stats
          </ThemedText>

          <ThemedView style={styles.statsList}>
            {data?.stats.map((stat, index) => (
              <View key={stat.stat.name}>
                <View style={styles.statRow}>
                  <ThemedText style={styles.statName}>
                    {stat.stat.name.toUpperCase()}
                  </ThemedText>
                  <ThemedText style={styles.statValue}>
                    {stat.base_stat}
                  </ThemedText>
                </View>
                {index < (data?.stats.length ?? 0) - 1 && (
                  <View style={styles.statDivider} />
                )}
              </View>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  centeredSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  pokemonImage: {
    flex: 0,
    minWidth: 110,
    marginBottom: 20,
  },
  pokemonName: {
    marginBottom: 15,
    textAlign: "center",
  },
  typeBadgesContainer: {
    flexDirection: "row",
    flex: 0,
    gap: 5,
    marginBottom: 30,
  },
  statsSection: {
    paddingHorizontal: 20,
  },
  statsHeader: {
    marginBottom: 15,
  },
  statsList: {
    flexDirection: "column",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  statName: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
  },
  statDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 5,
  },
});
