import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/auth-store";
import { useThemeStore } from "../../store/theme-store";
import { useRouter } from "expo-router";

const stats = [
  { label: "Calls", value: "247", icon: "videocam" as const, color: "#6c5ce7" },
  { label: "Messages", value: "1.2K", icon: "chatbubbles" as const, color: "#fd79a8" },
  { label: "Matches", value: "89", icon: "heart" as const, color: "#00b894" },
  { label: "Rating", value: "4.8", icon: "star" as const, color: "#fdcb6e" },
];

const menuSections = [
  {
    title: "General",
    items: [
      { icon: "settings-outline" as const, label: "Settings", color: "#8888a0" },
      { icon: "diamond-outline" as const, label: "Premium", color: "#fdcb6e", badge: "Pro" },
      { icon: "language-outline" as const, label: "Language", color: "#8888a0", value: "English" },
      { icon: "moon-outline" as const, label: "Dark Mode", color: "#8888a0", isToggle: true },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle-outline" as const, label: "Help Center", color: "#8888a0" },
      { icon: "shield-checkmark-outline" as const, label: "Privacy", color: "#8888a0" },
      { icon: "information-circle-outline" as const, label: "About", color: "#8888a0", value: "v1.0.0" },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mode, toggle } = useThemeStore();

  const displayName = user?.displayName || "Guest User";
  const email = user?.email || "guest@chatvibe.app";
  const avatar = user?.avatar || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  return (
    <ScrollView
      className="flex-1 bg-[#0a0a0f]"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
    >
      {/* Profile Header */}
      <View className="items-center px-4 pt-4 pb-6">
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: "#6c5ce7", borderWidth: 3, borderColor: "rgba(108, 92, 231, 0.3)" }}
        >
          <Text className="text-white text-3xl font-bold">{initials || "G"}</Text>
        </View>
        <Text className="text-white text-xl font-bold">{displayName}</Text>
        <Text className="text-[#8888a0] text-sm mt-1">{email}</Text>
        <Text className="text-[#555570] text-xs mt-2 text-center px-8 leading-5">
          Making connections one conversation at a time.
        </Text>
        <TouchableOpacity
          className="mt-4 h-10 px-6 rounded-xl items-center justify-center"
          style={{ backgroundColor: "rgba(108, 92, 231, 0.15)", borderWidth: 1, borderColor: "rgba(108, 92, 231, 0.3)" }}
        >
          <Text className="text-[#6c5ce7] font-semibold text-sm">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View
        className="mx-4 rounded-2xl p-4 flex-row justify-between"
        style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
      >
        {stats.map((stat, i) => (
          <View key={i} className="items-center flex-1">
            <Ionicons name={stat.icon} size={20} color={stat.color} />
            <Text className="text-white text-lg font-bold mt-1">{stat.value}</Text>
            <Text className="text-[#8888a0] text-xs">{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, sIdx) => (
        <View key={sIdx} className="mt-6 px-4">
          <Text className="text-[#8888a0] text-xs font-semibold uppercase tracking-wider mb-3 px-1">
            {section.title}
          </Text>
          <View
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
          >
            {section.items.map((item, iIdx) => (
              <TouchableOpacity
                key={iIdx}
                className="flex-row items-center px-4 py-4"
                style={{
                  borderBottomWidth: iIdx < section.items.length - 1 ? 1 : 0,
                  borderBottomColor: "rgba(255,255,255,0.05)",
                }}
                activeOpacity={0.7}
                onPress={"isToggle" in item && item.isToggle ? toggle : undefined}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text className="flex-1 text-white text-sm ml-3">{item.label}</Text>
                {"badge" in item && item.badge ? (
                  <View className="h-5 px-2 rounded-full items-center justify-center bg-[#6c5ce7]">
                    <Text className="text-white text-[10px] font-bold">{item.badge}</Text>
                  </View>
                ) : "value" in item && item.value ? (
                  <Text className="text-[#555570] text-sm">{item.value}</Text>
                ) : "isToggle" in item && item.isToggle ? (
                  <View className="w-10 h-6 rounded-full items-center justify-center" style={{ backgroundColor: mode === "dark" ? "#6c5ce7" : "#555570" }}>
                    <View className={`w-4 h-4 rounded-full bg-white ${mode === "dark" ? "self-end mr-0.5" : "self-start ml-0.5"}`} />
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity
        className="mx-4 mt-6 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: "rgba(231, 76, 60, 0.15)", borderWidth: 1, borderColor: "rgba(231, 76, 60, 0.3)" }}
        onPress={handleLogout}
      >
        <Text className="text-[#e74c3c] font-semibold">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
