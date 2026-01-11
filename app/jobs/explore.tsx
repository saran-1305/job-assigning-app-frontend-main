import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Explore() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const posts = [
    {
      id: 1,
      name: "Saran",
      message: "Looking for part-time helpers near Anna Nagar.",
    },
    {
      id: 2,
      name: "Ravi",
      message: "Completed house cleaning work today 👍",
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      className="flex-1 bg-bgmain px-4 pt-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-2xl font-bold text-textmain mb-4">
        Explore
      </Text>

      {posts.map((post) => (
        <View
          key={post.id}
          className="bg-card rounded-2xl p-4 mb-4"
        >
          <Text className="font-bold text-textmain mb-1">
            {post.name}
          </Text>
          <Text className="text-textmuted">
            {post.message}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
