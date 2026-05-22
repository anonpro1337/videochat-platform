import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const conversations: Conversation[] = [
  { id: "1", name: "Alice", avatar: "A", lastMessage: "Hey! How are you?", time: "2m", unread: 2, online: true },
  { id: "2", name: "Bob", avatar: "B", lastMessage: "See you tomorrow!", time: "1h", unread: 0, online: false },
  { id: "3", name: "Charlie", avatar: "C", lastMessage: "That sounds great!", time: "3h", unread: 5, online: true },
  { id: "4", name: "Diana", avatar: "D", lastMessage: "Yes, I agree", time: "5h", unread: 0, online: false },
  { id: "5", name: "Eve", avatar: "E", lastMessage: "Let's catch up soon", time: "1d", unread: 1, online: true },
];

const sampleMessages: Message[] = [
  { id: "1", text: "Hey there! How's it going?", sender: "other", time: "10:30" },
  { id: "2", text: "I'm doing great, thanks! How about you?", sender: "me", time: "10:31" },
  { id: "3", text: "Pretty good! Did you see the latest update?", sender: "other", time: "10:32" },
  { id: "4", text: "Not yet, what's new?", sender: "me", time: "10:33" },
  { id: "5", text: "They added new video filters and effects!", sender: "other", time: "10:34" },
  { id: "6", text: "That's awesome! I'll check it out now.", sender: "me", time: "10:35" },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(sampleMessages);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4"
      style={{ borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" }}
      onPress={() => setSelectedChat(item.id)}
      activeOpacity={0.7}
    >
      <View className="relative">
        <View
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: "#6c5ce7" }}
        >
          <Text className="text-white text-lg font-bold">{item.avatar}</Text>
        </View>
        {item.online && (
          <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0a0a0f] bg-[#00b894]" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-semibold text-base">{item.name}</Text>
          <Text className="text-[#555570] text-xs">{item.time}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-[#8888a0] text-sm flex-1 mr-2" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View className="min-w-[20px] h-5 rounded-full items-center justify-center px-1.5" style={{ backgroundColor: "#6c5ce7" }}>
              <Text className="text-white text-xs font-bold">{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    return (
      <View className={`flex-row ${isMe ? "justify-end" : "justify-start"} mb-3 px-4`}>
        <View
          className="max-w-[75%] rounded-2xl px-4 py-3"
          style={{
            backgroundColor: isMe ? "#6c5ce7" : "rgba(255, 255, 255, 0.08)",
            borderBottomRightRadius: isMe ? 4 : 16,
            borderBottomLeftRadius: isMe ? 16 : 4,
          }}
        >
          <Text className="text-white text-sm leading-5">{item.text}</Text>
          <Text className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-[#555570]"}`}>{item.time}</Text>
        </View>
      </View>
    );
  };

  if (selectedChat) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-[#0a0a0f]"
        style={{ paddingTop: insets.top }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Chat Header */}
        <View
          className="flex-row items-center px-4 py-3"
          style={{ borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" }}
        >
          <TouchableOpacity onPress={() => setSelectedChat(null)} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "#6c5ce7" }}>
            <Text className="text-white font-bold">{conversations.find((c) => c.id === selectedChat)?.avatar}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold">{conversations.find((c) => c.id === selectedChat)?.name}</Text>
            <Text className="text-[#00b894] text-xs">Online</Text>
          </View>
          <TouchableOpacity className="ml-2">
            <Ionicons name="call-outline" size={22} color="#6c5ce7" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-4">
            <Ionicons name="ellipsis-vertical" size={22} color="#8888a0" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          className="flex-1"
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View
          className="flex-row items-center px-4 py-3"
          style={{ borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" }}
        >
          <TouchableOpacity className="mr-2">
            <Ionicons name="add-circle-outline" size={28} color="#8888a0" />
          </TouchableOpacity>
          <View className="flex-1 h-11 rounded-xl px-4 flex-row items-center" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <TextInput
              className="flex-1 text-white text-sm"
              placeholder="Type a message..."
              placeholderTextColor="#555570"
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={20} color={messageText.trim() ? "#6c5ce7" : "#555570"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0a0f]" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4">
        <Text className="text-white text-2xl font-bold">Messages</Text>
        <Text className="text-[#8888a0] text-sm mt-1">Connect with people around the world</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
