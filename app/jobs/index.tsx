// app/jobs/index.tsx
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Job = {
  id: string;
  title: string;
  description: string;
  status: "Open" | "Closed";
};

const JOBS: Job[] = [
  {
    id: "1",
    title: "Job 1",
    description:
      "Buy milk for neighbour from nearby shop and drop at their house.",
    status: "Open",
  },
  {
    id: "2",
    title: "Job 2",
    description: "Pick up child from school and drop at home safely.",
    status: "Open",
  },
];

export default function JobsScreen() {
  return (
    // 🔹 same background as User Details / Create Account
    <View className="flex-1 bg-[#F5F1EC]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="text-[32px] font-bold text-[#0D1821] mb-6">
          Jobs Created
        </Text>

        {/* Job cards */}
        {JOBS.map((job) => (
          <View
            key={job.id}
            // 🔹 same card colour family as your grey inputs / Aadhaar box
            className="bg-[#F3EBE2] rounded-3xl px-5 py-4 mb-4"
          >
            {/* Header row */}
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-semibold text-[#0D1821]">
                {job.title}
              </Text>

              {/* status pill – light beige, like secondary buttons */}
              <View className="bg-[#E2D6CC] px-3 py-1 rounded-full">
                <Text className="text-[11px] text-[#555555]">
                  {job.status}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-sm text-[#444444] mb-4">
              {job.description}
            </Text>

            {/* Buttons */}
            <View className="flex-row gap-3">
              {/* light button */}
              <TouchableOpacity className="flex-1 bg-[#E2D6CC] rounded-full py-2 items-center">
                <Text className="text-[12px] font-medium text-[#333333]">
                  View Applicants
                </Text>
              </TouchableOpacity>

              {/* dark button – same as Continue button (#0D1821) */}
              <TouchableOpacity className="flex-1 bg-[#0D1821] rounded-full py-2 items-center">
                <Text className="text-[12px] font-medium text-white">
                  Cancel Job
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* placeholder empty cards */}
        <View className="bg-[#F3EBE2] rounded-3xl h-36 mb-4 opacity-70" />
        <View className="bg-[#F3EBE2] rounded-3xl h-36 mb-4 opacity-70" />
      </ScrollView>
    </View>
  );
}
