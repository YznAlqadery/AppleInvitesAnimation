import { View, Image, Dimensions, StyleSheet, Text } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Stagger } from "@animatereactnative/stagger";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  Easing,
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", // Colorful gradient
  "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45", // Northern lights
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee", // Autumn in Paris
  "https://images.unsplash.com/photo-1682687982501-1e58ab814714", // Abstract art
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e", // Mountain lake
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // Sunset over mountains
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", // Aerial beach view
];

// Add quality and size parameters to optimize image loading
const optimizedImages = images.map(
  (url) => `${url}?auto=format&q=80&w=800&fit=crop`
);

const { width } = Dimensions.get("window");
const _itemWidth = width * 0.62; // 62% of the screen width
const _itemHeight = _itemWidth * 1.67; // 16:9 aspect ratio
const _gap = 16; // Gap between images
const _itemSize = _itemWidth + _gap; // Total size of each item including gap

function Item({
  index,
  image,
  offset,
}: {
  index: number;
  image: string;
  offset: SharedValue<number>;
}) {
  const _styles = useAnimatedStyle(() => {
    const itemPosition = index * _itemSize - width - _itemSize / 2;
    const totalSize = images.length * _itemSize;

    const range =
      ((itemPosition - (offset.value + totalSize * 1000)) % totalSize) +
      width +
      _itemSize / 2;
    return {
      transform: [
        {
          rotate: `${interpolate(
            range,
            [-_itemSize, (width - _itemSize) / 2, width],
            [-3, 0, 3]
          )}deg`,
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _itemWidth,
          height: _itemHeight,
        },
        _styles,
      ]}
    >
      <Image
        source={{ uri: image }}
        style={{ flex: 1, borderRadius: 16 }}
        resizeMode="cover"
        // Add caching for better performance
      />
    </Animated.View>
  );
}

const AppleInvites = () => {
  const offset = useSharedValue(0); // Shared value for offset
  const [activeIndex, setActiveIndex] = useState(0); // State for active index
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images for smoother transitions
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePromises = optimizedImages.map((image) => {
          return Image.prefetch(image);
        });
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(false);
      }
    };

    preloadImages();
  }, []);

  useAnimatedReaction(
    () => {
      // Smooth out the calculation with a small damping factor
      const floatIndex =
        ((offset.value + width / 2) / _itemSize) % images.length;
      return Math.abs(Math.floor(floatIndex));
    },
    (value, previousValue) => {
      if (previousValue !== value) {
        runOnJS(setActiveIndex)(value); // Update active index
      }
    },
    [imagesLoaded] // Only run when images are loaded
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: 0.5, // Opacity for the background image
          },
        ]}
      >
        <Animated.Image
          key={`image-${activeIndex}`}
          source={{ uri: optimizedImages[activeIndex] }}
          style={{ flex: 1 }}
          blurRadius={50} // Blur effect
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
          resizeMode="cover"
        />
      </Animated.View>
      {imagesLoaded && (
        <Marquee
          spacing={_gap} // Space between items
          position={offset} // Position of the marquee
        >
          <Animated.View
            style={{ flexDirection: "row", alignItems: "center", gap: _gap }}
            entering={FadeInUp.delay(500)
              .duration(1000)
              .easing(Easing.elastic(0.9))
              .withInitialValues({
                transform: [{ translateY: -_itemHeight / 2 }],
              })}
          >
            {optimizedImages.map((image, index) => (
              <Item
                offset={offset}
                index={index}
                image={image}
                key={`image-${index}`}
              />
            ))}
          </Animated.View>
        </Marquee>
      )}
      {imagesLoaded && (
        <Stagger
          stagger={100}
          style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
          duration={500}
          initialEnteringDelay={1000}
        >
          <Text style={{ color: "white", fontWeight: "500", opacity: 0.5 }}>
            Welcome to
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            AppleInvitesAnimation
          </Text>
          <Text
            style={{
              color: "white",
              opacity: 0.5,
              textAlign: "center",
              paddingHorizontal: 6,
            }}
          >
            Experience the magic of seamless transitions and fluid animations in
            this beautifully crafted React Native showcase. Inspired by Apple's
            design philosophy, this component brings life to your mobile
            applications with smooth scrolling, elegant fades, and responsive
            interactions.
          </Text>
        </Stagger>
      )}
    </View>
  );
};

export default AppleInvites;
