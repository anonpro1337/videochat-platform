import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { id: "1", name: "Gaming", icon: "game-controller", color: "#6c5ce7", count: "12.4K" },
  { id: "2", name: "Music", icon: "musical-notes", color: "#fd79a8", count: "8.2K" },
  { id: "3", name: "Art", icon: "color-palette", color: "#fdcb6e", count: "6.7K" },
  { id: "4", name: "Tech", icon: "laptop", color: "#00b894", count: "5.1K" },
  { id: "5", name: "Sports", icon: "football", color: "#e17055", count: "4.8K" },
  { id: "6", name: "Travel", icon: "airplane", color: "#00cec9", count: "3.9K" },
];

const trendingUsers = [
  { id: "1", name: "Sofia Chen", avatar: "S", flag: "🌍", tag: "#creative", online: true, viewers: "2.1K" },
  { id: "2", name: "Marcus Kim", avatar: "M", flag: "🌍", tag: "#gamer", online: true, viewers: "1.8K" },
  { id: "3", name: "Lena Voss", avatar: "L", flag: "🌍", tag: "#artist", online: false, viewers: "1.2K" },
  { id: "4", name: "Alex Rivera", avatar: "A", flag: "🌍", tag: "#musician", online: true, viewers: "980" },
];

const communities = [
  { id: "1", name: "Creative Minds", members: "15.2K", icon: "bulb", color: "#6c5ce7" },
  { id: "2", name: "Global Gamers", members: "12.8K", icon: "game-controller", color: "#fd79a8" },
  { id: "3", name: "Music Lovers", members: "10.4K", icon: "headset", color: "#00b894" },
  { id: "4", name: "Tech Talks", members: "8.7K", icon: "hardware-chip", color: "#fdcb6e" },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  return (
    <ScrollView
      className="flex-1 bg-[#0a0a0f]"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      {/* Header */}
      <View className="px-4 mb-6">
        <Text className="text-white text-2xl font-bold">Explore</Text>
        <Text className="text-[#8888a0] text-sm mt-1">Discover new connections</Text>
      </View>

      {/* Search */}
      <View className="mx-4 mb-6">
        <View
          className="h-12 rounded-xl px-4 flex-row items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Ionicons name="search" size={18} color="#555570" />
          <TextInput
            className="flex-1 text-white text-sm ml-3"
            placeholder="Search people, communities..."
            placeholderTextColor="#555570"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Categories */}
      <View className="px-4 mb-6">
        <Text className="text-white text-lg font-semibold mb-4">Categories</Text>
        <View className="flex-row flex-wrap justify-between">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className="w-[31%] rounded-2xl p-4 items-center mb-3"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
              activeOpacity={0.7}
            >
              <View
                className="w-11 h-11 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Ionicons name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <Text className="text-white text-xs font-semibold">{cat.name}</Text>
              <Text className="text-[#555570] text-[10px] mt-1">{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trending Users */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text className="text-white text-lg font-semibold">Trending</Text>
          <TouchableOpacity>
            <Text className="text-[#6c5ce7] text-sm font-medium">See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4">
          <View className="flex-row px-4 gap-3">
            {trendingUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                className="w-36 rounded-2xl p-4 items-center"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
                activeOpacity={0.7}
              >
                <View className="relative mb-2">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#6c5ce7" }}
                  >
                    <Text className="text-white text-xl font-bold">{user.avatar}</Text>
                  </View>
                  {user.online && (
                    <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0f] bg-[#00b894]" />
                  )}
                </View>
                <Text className="text-white text-sm font-semibold">{user.name}</Text>
                <Text className="text-[#6c5ce7] text-xs mt-1">{user.tag}</Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="eye-outline" size={12} color="#555570" />
                  <Text className="text-[#555570] text-[10px] ml-1">{user.viewers}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Communities */}
      <View className="px-4 mb-6">
        <Text className="text-white text-lg font-semibold mb-4">Communities</Text>
        {communities.map((comm) => (
          <TouchableOpacity
            key={comm.id}
            className="flex-row items-center rounded-2xl p-4 mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: `${comm.color}20` }}>
              <Ionicons name={comm.icon as any} size={24} color={comm.color} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-white font-semibold">{comm.name}</Text>
              <Text className="text-[#8888a0] text-xs mt-0.5">{comm.members} members</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#555570" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
