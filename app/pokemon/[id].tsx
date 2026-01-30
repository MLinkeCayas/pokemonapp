import { PokemonImage } from "@/components/pokemon-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedTypeBadge } from "@/components/themed-type-badge";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/hooks/use-pokemons";

import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isLoading, error } = usePokemon(parseInt(id, 10));

  const [battleIntroComplete, setBattleIntroComplete] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const pokemonSlideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const statsSlideAnim = useRef(new Animated.Value(80)).current;
  const statsOpacityAnim = useRef(new Animated.Value(0)).current;

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const skipBattleIntro = () => {
    if (animationRef.current) animationRef.current.stop();
    flashAnim.setValue(0);
    pokemonSlideAnim.setValue(0);
    textOpacity.setValue(0);
    textScale.setValue(1);
    contentFadeAnim.setValue(1);
    setBattleIntroComplete(true);
  };

  const runBattleIntro = () => {
    const animation = Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 80,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 4 },
      ),
      Animated.spring(pokemonSlideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]);
    animationRef.current = animation;
    animation.start(() => setBattleIntroComplete(true));
  };

  useEffect(() => {
    if (data?.name) {
      navigation.setOptions({ title: `Pokemon ${data.name.toUpperCase()}` });
      runBattleIntro();
    }
  }, [data?.name, navigation]);

  useEffect(() => {
    if (battleIntroComplete) {
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.spring(statsSlideAnim, {
            toValue: 0,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(statsOpacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [battleIntroComplete]);

  if (isLoading) return <ThemedText type="title">Loading...</ThemedText>;
  if (error)
    return <ThemedText type="title">Error: {error.message}</ThemedText>;

  return (
    <ThemedView style={styles.container}>
      {!battleIntroComplete && (
        <Pressable
          style={styles.battleIntroContainer}
          onPress={skipBattleIntro}
        >
          <Animated.View
            style={[styles.flashOverlay, { opacity: flashAnim }]}
          />
          <View style={styles.battleScene}>
            <Animated.View
              style={[
                styles.battlePokemonContainer,
                { transform: [{ translateX: pokemonSlideAnim }] },
              ]}
            >
              <PokemonImage
                imagePath={data?.sprites.front_animated as string}
                imageHeight={200}
                imageWidth={200}
                style={styles.battlePokemonImage}
              />
              <Image
                source={require("@/assets/images/grass.png")}
                style={styles.battleGrass}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.battleTextContainer,
                { opacity: textOpacity, transform: [{ scale: textScale }] },
              ]}
            >
              <View style={styles.battleTextBox}>
                <ThemedText style={styles.battleText}>
                  Wild {data?.name?.toUpperCase()} appeared!
                </ThemedText>
              </View>
            </Animated.View>
          </View>
        </Pressable>
      )}

      <Animated.View style={[styles.mainContent, { opacity: contentFadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          <ThemedView style={styles.centeredSection}>
            <View style={styles.pokemonDisplayContainer}>
              <PokemonImage
                imagePath={data?.sprites.front_animated as string}
                imageHeight={200}
                imageWidth={200}
                style={styles.pokemonImage}
              />
              <Image
                source={require("@/assets/images/grass.png")}
                style={{ width: 200, height: 100, marginTop: -110 }}
              />
            </View>

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
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  centeredSection: { alignItems: "center", paddingVertical: 20 },
  pokemonImage: { flex: 0, minWidth: 110, marginBottom: 20 },
  pokemonName: { marginBottom: 15, textAlign: "center" },
  typeBadgesContainer: {
    flexDirection: "row",
    flex: 0,
    gap: 5,
    marginBottom: 30,
  },
  statsSection: { paddingHorizontal: 20 },
  statsHeader: { marginBottom: 15 },
  statsList: { flexDirection: "column" },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  statName: { fontSize: 16 },
  statValue: { fontSize: 16 },
  statDivider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 5 },
  battleIntroContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    zIndex: 11,
  },
  battleScene: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  battlePokemonContainer: {
    alignItems: "center",
    marginBottom: 20,
    overflow: "visible",
  },
  battlePokemonImage: { flex: 0, width: 200, height: 200 },
  battleGrass: { width: 200, height: 100, marginTop: -110 },
  battleTextContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
  },
  battleTextBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#333",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  battleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  mainContent: { flex: 1 },
  pokemonDisplayContainer: { alignItems: "center" },
});
