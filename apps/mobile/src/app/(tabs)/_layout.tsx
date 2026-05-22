import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TabIconName = React.ComponentProps<typeof Ionicons>["name"];

const tabs: {
  name: string;
  label: string;
  icon: TabIconName;
  iconFocused: TabIconName;
}[] = [
  { name: "index", label: "Home", icon: "home-outline", iconFocused: "home" },
  { name: "video", label: "Video", icon: "videocam-outline", iconFocused: "videocam" },
  { name: "chat", label: "Chat", icon: "chatbubbles-outline", iconFocused: "chatbubbles" },
  { name: "explore", label: "Explore", icon: "compass-outline", iconFocused: "compass" },
  { name: "profile", label: "Profile", icon: "person-outline", iconFocused: "person" },
];

function TabIcon({ focused, icon, iconFocused }: { focused: boolean; icon: TabIconName; iconFocused: TabIconName }) {
  return (
    <Ionicons
      name={focused ? iconFocused : icon}
      size={22}
      color={focused ? "#6c5ce7" : "#555570"}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(10, 10, 15, 0.92)",
          borderTopColor: "rgba(255, 255, 255, 0.08)",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          position: Platform.OS === "web" ? "fixed" : "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          zIndex: 100,
        },
        tabBarActiveTintColor: "#6c5ce7",
        tabBarInactiveTintColor: "#555570",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarBackground: () => (
          <View className="absolute inset-0 bg-[#0a0a0f]/90" />
        ),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} iconFocused={tab.iconFocused} />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={{
                  color: focused ? "#6c5ce7" : color,
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                {tab.label}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
