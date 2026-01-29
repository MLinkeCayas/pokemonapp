import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/hooks/use-pokemons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isLoading, error } = usePokemon(parseInt(id, 10));

  const pokeballScale = useRef(new Animated.Value(1)).current;
  const pokemonY = useRef(new Animated.Value(0)).current; // start behind
  const pokemonScale = useRef(new Animated.Value(0)).current; // completely hidden
  const pokemonSpin = useRef(new Animated.Value(0)).current;

  const animateReveal = () => {
    // Pokeball shake
    const shake = Animated.sequence([
      Animated.timing(pokeballScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pokeballScale, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);

    const popOut = Animated.parallel([
      Animated.timing(pokemonY, {
        toValue: 0, // move to original position
        duration: 500,
        easing: Easing.out(Easing.elastic(1)),
        useNativeDriver: true,
      }),
      Animated.timing(pokemonScale, {
        toValue: 1, // full size
        duration: 500,
        easing: Easing.out(Easing.elastic(1)),
        useNativeDriver: true,
      }),
      Animated.timing(pokemonSpin, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([shake, popOut]).start();
  };

  const spin = pokemonSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    // Set the title dynamically based on the Pokemon ID
    if (data?.name) {
      navigation.setOptions({
        title: `Pokemon ${data?.name.toUpperCase() as string}`,
      });
    }
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
          <TouchableWithoutFeedback onPress={animateReveal}>
            <Animated.View style={{ transform: [{ scale: pokeballScale }] }}>
              <Image
                source={require("../../assets/images/pokeball.png")}
                style={styles.pokeball}
              />
            </Animated.View>
          </TouchableWithoutFeedback>

          <Animated.Image
            source={{ uri: data?.sprites.front_default as string }}
            style={{
              ...styles.pokemon,
              transform: [
                { translateY: pokemonY },
                { scale: pokemonScale },
                { rotate: spin },
              ],
            }}
          />

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
  pokeball: {
    width: 200,
    height: 200,
  },
  pokemon: {
    width: 200,
    height: 200,
    position: "absolute",
  },
});
