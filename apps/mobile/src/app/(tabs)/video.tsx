import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const filters = ["All", "Male", "Female", "Nearby", "Global"];

type CallState = "idle" | "connecting" | "connected";

export default function VideoScreen() {
  const insets = useSafeAreaInsets();
  const [callState, setCallState] = useState<CallState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const startCall = async () => {
    setCallState("connecting");
    setTimeout(() => setCallState("connected"), 1500);
  };

  const endCall = () => {
    setCallState("idle");
    setIsMuted(false);
    setIsSpeaker(false);
  };

  return (
    <View className="flex-1 bg-[#0a0a0f]" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-3 flex-row items-center justify-between">
        <Text className="text-white text-lg font-bold">
          {callState === "connected" ? "Connected" : callState === "connecting" ? "Connecting..." : "Video Chat"}
        </Text>
        {callState === "connected" && (
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-[#00b894] mr-2" />
            <Text className="text-[#00b894] text-sm">Live</Text>
          </View>
        )}
      </View>

      <View className="flex-1 mx-4 rounded-2xl overflow-hidden" style={{ backgroundColor: "#14141f" }}>
        {callState === "idle" ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-24 h-24 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "rgba(108, 92, 231, 0.2)" }}>
              <Ionicons name="videocam" size={40} color="#6c5ce7" />
            </View>
            <Text className="text-white text-xl font-bold">Ready to Connect?</Text>
            <Text className="text-[#8888a0] text-center mt-2 px-8">
              Tap the button below to start a random video chat
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#0d0d18" }}>
              {callState === "connecting" ? (
                <>
                  <Ionicons name="sync-circle" size={48} color="#6c5ce7" />
                  <Text className="text-[#8888a0] mt-3">Finding someone to chat with...</Text>
                </>
              ) : (
                <>
                  <View className="w-20 h-20 rounded-full items-center justify-center mb-3" style={{ backgroundColor: "#6c5ce7" }}>
                    <Text className="text-white text-3xl font-bold">S</Text>
                  </View>
                  <Text className="text-white text-lg font-semibold">Stranger</Text>
                  <Text className="text-[#00b894] text-sm mt-1">Connected</Text>
                </>
              )}
            </View>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 px-4" contentContainerStyle={{ gap: 8 }}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            className="h-9 px-4 rounded-full items-center justify-center"
            style={{
              backgroundColor: selectedFilter === f ? "#6c5ce7" : "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: selectedFilter === f ? "#6c5ce7" : "rgba(255,255,255,0.1)",
            }}
            onPress={() => setSelectedFilter(f)}
          >
            <Text className="text-white text-sm font-medium">{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-4 py-6 flex-row items-center justify-center gap-4" style={{ paddingBottom: insets.bottom + 80 }}>
        {callState === "idle" ? (
          <TouchableOpacity
            className="h-16 w-16 rounded-full items-center justify-center"
            style={{ backgroundColor: "#6c5ce7" }}
            onPress={startCall}
          >
            <Ionicons name="videocam" size={28} color="white" />
          </TouchableOpacity>
        ) : (
          <>
            <ControlButton icon={isMuted ? "mic-off" : "mic"} active={isMuted} onPress={() => setIsMuted(!isMuted)} />
            <ControlButton icon="camera-reverse" active={false} onPress={() => {}} />
            <TouchableOpacity
              className="h-16 w-16 rounded-full items-center justify-center"
              style={{ backgroundColor: "#e74c3c" }}
              onPress={endCall}
            >
              <Ionicons name="call" size={28} color="white" />
            </TouchableOpacity>
            <ControlButton icon={isSpeaker ? "volume-high" : "volume-mute"} active={isSpeaker} onPress={() => setIsSpeaker(!isSpeaker)} />
            <ControlButton icon="ellipsis-horizontal" active={false} onPress={() => {}} />
          </>
        )}
      </View>
    </View>
  );
}

function ControlButton({
  icon,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="h-14 w-14 rounded-full items-center justify-center"
      style={{ backgroundColor: active ? "#6c5ce7" : "rgba(255, 255, 255, 0.1)" }}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={active ? "white" : "#8888a0"} />
    </TouchableOpacity>
  );
}
