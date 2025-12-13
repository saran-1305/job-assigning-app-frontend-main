// app/jobs/applications.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
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

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 40,
        }}
      >
        <Text className="text-3xl font-bold text-[#111827] mb-6">
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
            className="bg-[#F5F5F5] rounded-3xl p-5 mb-4"
          >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-semibold text-[#111827] flex-1 mr-2">
                {job.title}
              </Text>

              <View className="bg-[#E5E7EB] rounded-full px-3 py-1">
                <Text className="text-xs text-[#111827]">
                  {job.payment}
                </Text>
              </View>
            </View>

            <Text className="text-sm text-[#111827] mb-2">
              {job.description}
            </Text>

            <Text className="text-xs text-gray-600">
               {job.location} • {job.totalTime}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* BOTTOM NAVBAR */}
      <View className="flex-row justify-around items-center bg-white border-t border-[#E5E7EB] py-3">

        {/* CURRENT SCREEN */}
        <TouchableOpacity onPress={() => router.push("/jobs")}  className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#111827] items-center justify-center">
          <FontAwesome name="plus" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Briefcase  */}
        <TouchableOpacity onPress={() => router.push("/jobs/jobapplication")} className="w-16 h-16 rounded-2xl border bg-[#111827] items-center justify-center">
          <FontAwesome name="briefcase" size={22} color="#FFFFFF"/>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          //onPress={() => router.push("/profile")}
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
