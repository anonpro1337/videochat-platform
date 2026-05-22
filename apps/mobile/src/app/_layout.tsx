import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/auth-store";
import { useThemeStore } from "../store/theme-store";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isHydrated, hydrate } = useAuthStore();
  const { hydrate: hydrateTheme } = useThemeStore();

  useEffect(() => {
    hydrate();
    hydrateTheme();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup) {
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isHydrated, segments]);

  if (!isHydrated) {
    return (
      <View className="flex-1 bg-[#0a0a0f] items-center justify-center">
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
