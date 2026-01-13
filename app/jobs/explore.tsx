import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SkillPost = {
  id: string;
  name: string;
  skill: string;
  description: string;
  photo: string;
};

export default function ExploreScreen() {
  const [skills] = useState<SkillPost[]>([
    {
      id: "1",
      name: "Arjun",
      skill: "Piano Player",
      description: "Classical & light music. 5+ years experience.",
      photo: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    },
  ]);

  const requestJob = (skill: string, name: string) => {
    Alert.alert(
      "Job Requested",
      `Your request for ${skill} has been sent to ${name}`
    );
  };

  return (
    <View className="flex-1 bg-bgmain">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* HEADER */}
        <View className="mt-10 mb-6">
          <Text className="text-textmain text-xl">Welcome</Text>
          <Text className="text-textmain text-3xl font-bold">Name</Text>
          <Text className="text-texmain text-xl text-center font-bold">Explore</Text>
        </View>

        {/* SKILL CARDS */}
        {skills.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-3xl border border-card mb-5 overflow-hidden"
          >
            {/* IMAGE */}
            <Image
              source={{ uri: item.photo }}
              className="w-full h-44"
              resizeMode="cover"
            />

            {/* CONTENT */}
            <View className="p-4">
              <Text className="text-textmain text-lg font-semibold">
                {item.skill}
              </Text>

              <Text className="text-sm text-gray-600 mt-1">
                {item.name}
              </Text>

              <Text className="text-sm text-gray-600 mt-2">
                {item.description}
              </Text>

              <TouchableOpacity
                onPress={() => requestJob(item.skill, item.name)}
                className="mt-4 bg-textmain py-3 rounded-xl"
              >
                <Text className="text-white text-center font-medium">
                  Request Job
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
