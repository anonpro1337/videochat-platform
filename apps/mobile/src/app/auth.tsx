import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/auth-store";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, register, loginWithGuest, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<"login" | "register" | "guest">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    clearError();
    try {
      if (mode === "login") {
        await login(email, password);
      } else if (mode === "register") {
        await register(email, password, username);
      } else {
        await loginWithGuest();
      }
      if (!useAuthStore.getState().error) {
        router.replace("/(tabs)");
      }
    } catch {
      // error is set in the store
    }
  };

  const toggleMode = () => {
    clearError();
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0a0a0f]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 80, paddingBottom: 40, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo & Title */}
        <View className="items-center mb-10">
          <View
            className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
            style={{ backgroundColor: "#6c5ce7" }}
          >
            <Ionicons name="chatbubbles" size={36} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold">ChatVibe</Text>
          <Text className="text-[#8888a0] text-sm mt-2">Connect, Chat, Vibe</Text>
        </View>

        {/* Form */}
        <View
          className="rounded-3xl p-6"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Text className="text-white text-xl font-bold mb-6">
            {mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Join as Guest"}
          </Text>

          {error && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-400 text-sm">{error}</Text>
            </View>
          )}

          {mode === "register" ? (
            <View className="mb-4">
              <Text className="text-[#8888a0] text-xs font-semibold uppercase tracking-wider mb-2">Username</Text>
              <View
                className="h-12 rounded-xl px-4 flex-row items-center"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
              >
                <Ionicons name="person-outline" size={18} color="#555570" />
                <TextInput
                  className="flex-1 text-white text-sm ml-3"
                  placeholder="Choose a username"
                  placeholderTextColor="#555570"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="text-[#8888a0] text-xs font-semibold uppercase tracking-wider mb-2">Email</Text>
            <View
              className="h-12 rounded-xl px-4 flex-row items-center"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <Ionicons name="mail-outline" size={18} color="#555570" />
              <TextInput
                className="flex-1 text-white text-sm ml-3"
                placeholder="Enter your email"
                placeholderTextColor="#555570"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-[#8888a0] text-xs font-semibold uppercase tracking-wider mb-2">Password</Text>
            <View
              className="h-12 rounded-xl px-4 flex-row items-center"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#555570" />
              <TextInput
                className="flex-1 text-white text-sm ml-3"
                placeholder="Enter your password"
                placeholderTextColor="#555570"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#555570" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="h-12 rounded-xl items-center justify-center mb-4"
            style={{ backgroundColor: "#6c5ce7" }}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Continue as Guest"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={toggleMode}>
            <Text className="text-[#8888a0] text-sm">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <Text className="text-[#6c5ce7] font-semibold">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          {mode === "login" && (
            <>
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <Text className="text-[#555570] text-xs mx-4">OR</Text>
                <View className="flex-1 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              </View>

              {/* Social Buttons */}
              <View className="flex-row gap-3">
                <SocialButton icon="logo-google" label="Google" />
                <SocialButton icon="logo-apple" label="Apple" />
              </View>

              <TouchableOpacity
                className="h-12 rounded-xl items-center justify-center mt-3"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
                onPress={async () => {
                  await loginWithGuest();
                  router.replace("/(tabs)");
                }}
              >
                <Text className="text-white text-sm font-medium">Continue as Guest</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SocialButton({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string }) {
  return (
    <TouchableOpacity
      className="flex-1 h-12 rounded-xl items-center justify-center flex-row"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={18} color="white" />
      <Text className="text-white text-sm font-medium ml-2">{label}</Text>
    </TouchableOpacity>
  );
}
