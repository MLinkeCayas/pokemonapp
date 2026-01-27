import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";

interface PokemonImageProps {
  style?: StyleProp<ImageStyle>;
  imagePath: string;
  imageHeight: number;
  imageWidth: number;
}

export function PokemonImage({
  imagePath,
  imageHeight,
  imageWidth,
  style,
}: PokemonImageProps) {
  return (
    <Image
      source={{ uri: imagePath }}
      style={[
        styles.imageHeader,
        { width: imageWidth, height: imageHeight },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  imageHeader: {
    flex: 1,
    width: 100,
    height: 100,
  },
});
