import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
  type: "text" | "image" | "location";
}

interface ChatRoom {
  id: string;
  participants: string[];
  jobId: string;
  createdAt: any;
}

export default function ChatScreen() {
  const { chatRoomId, jobTitle } = useLocalSearchParams<{
    chatRoomId: string;
    jobTitle?: string;
  }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatRoomId) {
      setLoading(false);
      return;
    }

    // Fetch chat room info
    const fetchChatRoom = async () => {
      try {
        const chatRoomDoc = await getDoc(doc(db, "chatRooms", chatRoomId));
        if (chatRoomDoc.exists()) {
          setChatRoom({ id: chatRoomDoc.id, ...chatRoomDoc.data() } as ChatRoom);
        }
      } catch (error) {
        console.error("Error fetching chat room:", error);
      }
    };
    fetchChatRoom();

    // Subscribe to messages
    const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId || !user) return;

    setSending(true);
    try {
      const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
      await addDoc(messagesRef, {
        senderId: (user as any)._id || user.id,
        text: newMessage.trim(),
        type: "text",
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === ((user as any)?._id || user?.id);

    return (
      <View
        className={`mb-3 max-w-[80%] ${
          isMyMessage ? "self-end" : "self-start"
        }`}
      >
        <View
          className={`px-4 py-3 rounded-2xl ${
            isMyMessage
              ? "bg-[#166534] rounded-br-none"
              : "bg-white border border-[#DCFCE7] rounded-bl-none"
          }`}
        >
          <Text
            className={`${isMyMessage ? "text-white" : "text-[#14532D]"}`}
          >
            {item.text}
          </Text>
        </View>
        {item.timestamp && (
          <Text
            className={`text-xs text-gray-400 mt-1 ${
              isMyMessage ? "text-right" : "text-left"
            }`}
          >
            {item.timestamp.toDate
              ? item.timestamp.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        )}
      </View>
    );
  };

  if (!chatRoomId) {
    return (
      <View className="flex-1 bg-[#F0FDF4] items-center justify-center">
        <Text className="text-[#14532D]">No chat room specified</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 flex-row items-center gap-2"
        >
          <FontAwesome name="arrow-left" size={16} color="#14532D" />
          <Text className="text-[#14532D] font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F0FDF4]"
    >
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-14 pb-4 bg-white border-b border-[#DCFCE7]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <FontAwesome name="arrow-left" size={20} color="#14532D" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-[#14532D]">
            {jobTitle || "Chat"}
          </Text>
          <Text className="text-xs text-gray-500">
            {chatRoom ? "Active conversation" : "Loading..."}
          </Text>
        </View>
      </View>

      {/* MESSAGES */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#166534" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            flexGrow: 1,
            justifyContent: messages.length === 0 ? "center" : "flex-start",
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View className="items-center">
              <FontAwesome name="comments" size={48} color="#ccc" />
              <Text className="text-gray-500 mt-4 text-center">
                No messages yet.{"\n"}Start the conversation!
              </Text>
            </View>
          }
        />
      )}

      {/* INPUT */}
      <View className="flex-row items-center px-4 py-3 bg-white border-t border-[#DCFCE7]">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 bg-[#F0FDF4] px-4 py-3 rounded-full mr-3 text-[#14532D]"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            !newMessage.trim() || sending ? "bg-gray-300" : "bg-[#166534]"
          }`}
        >
          {sending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FontAwesome name="send" size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
