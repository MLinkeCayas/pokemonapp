import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/hooks/use-pokemons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, View } from "react-native";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isLoading, error } = usePokemon(parseInt(id, 10));

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const vibrateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const moveX = moveAnim.interpolate({
    inputRange: [0, 0.25, 0.75, 1],
    outputRange: [0, 100, -100, 0],
  });

  const vibrateX = vibrateAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -5, 5, -5, 0], // small quick shake left and right
  });

  const scale = scaleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const fadeIn = () => {
    // Main animations
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      // Spin
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      // Move left-right and back to start
      Animated.timing(moveAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(vibrateAnim, {
        toValue: 1,
        duration: 100, // very fast shake
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stop vibration after main animation ends
      vibrateAnim.stopAnimation();
      vibrateAnim.setValue(0); // reset to 0
    });
  };

  const animateAll = () => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Continuous loop for spinning, moving, vibrating, scaling
    Animated.loop(
      Animated.parallel([
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(vibrateAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]),
    ).start();
  };

  useEffect(() => {
    // Set the title dynamically based on the Pokemon ID
    if (data?.name) {
      navigation.setOptions({
        title: `Pokemon ${data?.name.toUpperCase() as string}`,
      });

      animateAll();
      //fadeIn();
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
                transform: [
                  { rotate: spin },
                  { translateX: moveX },
                  { translateX: vibrateX },
                  { scale },
                ],
              },
            ]}
          >
            <PokemonImage
              imagePath={data?.sprites.front_default as string}
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
