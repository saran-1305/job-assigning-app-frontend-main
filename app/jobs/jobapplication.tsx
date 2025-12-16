// app/jobs/applications.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Job = {
  id: string;
  title: string;
  description: string;
  payment: string;
  location: string;
  totalTime: string;
};

export default function JobApplicationsScreen() {
  const router = useRouter();

  const [jobs] = useState<Job[]>([
    {
      id: "101",
      title: "Buy Groceries",
      description: "Buy groceries and deliver to elderly neighbour.",
      payment: "₹250",
      location: "Anna Nagar",
      totalTime: "1 hour",
    },
    {
      id: "102",
      title: "Dog Walking",
      description: "Walk dog in the evening for 30 minutes.",
      payment: "₹150",
      location: "T. Nagar",
      totalTime: "30 mins",
    },
    {
      id: "103",
      title: "House Cleaning",
      description: "Basic house cleaning work.",
      payment: "₹500",
      location: "Velachery",
      totalTime: "2 hours",
    },
  ]);

  const openInMaps = (location: string) => {
    if (!location) return;
    const query = encodeURIComponent(location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    /* APP BACKGROUND */
    <View className="flex-1 bg-[#F0FDF4]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 40,
        }}
      >
        <Text className="text-3xl font-bold text-[#14532D] mb-6">
          Available Jobs
        </Text>

        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/jobs/jobdetails",
                params: { job: JSON.stringify(job) },
              })
            }
            className="bg-[#cff5de] rounded-3xl p-5 mb-4"
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-semibold text-[#14532D] flex-1 mr-2">
                {job.title}
              </Text>

              <View className="bg-[#DCFCE7] rounded-full px-3 py-1">
                <Text className="text-xs text-[#14532D]">
                  {job.payment}
                </Text>
              </View>
            </View>

            <Text className="text-sm text-[#14532D] mb-2">
              {job.description}
            </Text>

            <Text className="text-xs text-gray-600 mb-2">
              {job.location} • {job.totalTime}
            </Text>

            <TouchableOpacity
              onPress={() => openInMaps(job.location)}
              className="mt-1 self-start bg-[#166534] px-4 py-2 rounded-full"
            >
              <Text className="text-xs text-white">
                Open in Google Maps
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View className="flex-row justify-around items-center bg-[##F0FDF4] border-t border-[#cff5de] py-3">
        <TouchableOpacity
          onPress={() => router.push("/jobs")}
          className="w-16 h-16 rounded-2xl bg-white border border-[#166534] items-center justify-center"
        >
          <FontAwesome name="plus" size={22} color="#166534" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/jobs/jobapplication")}
          className="w-16 h-16 rounded-2xl bg-[#166534] items-center justify-center"
        >
          <FontAwesome name="briefcase" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-16 h-16 rounded-2xl bg-white border border-[#166534] items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#166534" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
