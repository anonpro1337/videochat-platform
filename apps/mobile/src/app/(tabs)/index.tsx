import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const features = [
  { icon: "videocam" as const, title: "Video Chat", desc: "Face-to-face with anyone, anywhere", color: "#6c5ce7" },
  { icon: "chatbubbles" as const, title: "Instant Chat", desc: "Real-time messaging with flair", color: "#00b894" },
  { icon: "people" as const, title: "Communities", desc: "Find your people, join the vibe", color: "#fd79a8" },
  { icon: "globe" as const, title: "Explore", desc: "Discover trending profiles & content", color: "#fdcb6e" },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-[#0a0a0f]"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      {/* Hero Section */}
      <View className="px-6 pt-8 pb-10">
        <Text className="text-4xl font-bold text-white">ChatVibe</Text>
        <Text className="text-5xl font-bold mt-1">
          <Text className="text-[#6c5ce7]">Connect</Text>
          <Text className="text-white">, </Text>
          <Text className="text-[#fd79a8]">Chat</Text>
          <Text className="text-white">, </Text>
          <Text className="text-[#00b894]">Vibe</Text>
        </Text>
        <Text className="text-[#8888a0] text-base mt-3 leading-6">
          Experience the next generation of video conversations. Meet people, build connections, and share moments.
        </Text>
        <TouchableOpacity
          className="mt-6 h-14 rounded-2xl items-center justify-center flex-row"
          style={{ backgroundColor: "#6c5ce7" }}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/video")}
        >
          <Ionicons name="videocam" size={20} color="white" />
          <Text className="text-white font-semibold text-base ml-2">Start Chatting</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Cards */}
      <View className="px-4">
        <Text className="text-white text-lg font-semibold px-2 mb-4">Why ChatVibe?</Text>
        <View className="flex-row flex-wrap justify-between">
          {features.map((f, i) => (
            <View
              key={i}
              className="w-[48%] rounded-2xl p-4 mb-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mb-3"
                style={{ backgroundColor: `${f.color}20` }}
              >
                <Ionicons name={f.icon} size={20} color={f.color} />
              </View>
              <Text className="text-white font-semibold text-sm">{f.title}</Text>
              <Text className="text-[#8888a0] text-xs mt-1 leading-4">{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Trending Section */}
      <View className="mt-6 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-lg font-semibold">Trending Now</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text className="text-[#6c5ce7] text-sm font-medium">See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6">
          <View className="flex-row px-6 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className="w-36 rounded-2xl p-4 items-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
              >
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: "#6c5ce7" }}
                >
                  <Text className="text-white text-xl font-bold">A</Text>
                </View>
                <Text className="text-white text-sm font-semibold">User {i}</Text>
                <Text className="text-[#8888a0] text-xs mt-1">Online</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Stats Bar */}
      <View
        className="mx-6 mt-6 rounded-2xl p-5 flex-row justify-between"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
      >
        {[
          { label: "Users", value: "50K+" },
          { label: "Online", value: "2.1K" },
          { label: "Matches", value: "99%" },
        ].map((s, i) => (
          <View key={i} className="items-center">
            <Text className="text-white text-lg font-bold">{s.value}</Text>
            <Text className="text-[#8888a0] text-xs mt-1">{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
