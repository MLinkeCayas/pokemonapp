import { Image, StyleSheet } from "react-native";

export async function LoadImage(
  imagePath: string,
  imageHeight: number,
  imageWidth: number,
) {
  return (
    <Image
      source={{ uri: imagePath }}
      style={[
        styles.imageHeader,
        { width: imageWidth, height: imageHeight, flex: 1 },
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
