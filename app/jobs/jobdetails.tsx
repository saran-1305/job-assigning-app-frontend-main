import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  isAccepted?: boolean; // 👈 KEY FLAG
};

export default function JobDetailsScreen() {
  const { job } = useLocalSearchParams<{ job: string }>();

  if (!job) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F0FDF4]">
        <Text className="text-[#14532D]">No job data found</Text>
      </View>
    );
  }

  const parsedJob: Job = JSON.parse(job);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    Alert.alert("Applied", "You have successfully applied for this job.");
  };

  const openInMaps = () => {
    const query = encodeURIComponent(parsedJob.location);
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${query}`
    );
  };

  return (
    <View className="flex-1 bg-[#F0FDF4]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {/* HEADER */}
        <View className="mb-6 mt-10">
          <Text className="text-[#14532D] text-3xl font-bold">
            Job Details
          </Text>
        </View>

        {/* JOB CARD */}
        <View className="bg-white rounded-3xl border border-[#DCFCE7] p-5 mb-6">
          {/* TITLE + PAYMENT */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-[#14532D] text-xl font-semibold flex-1 mr-3">
              {parsedJob.title}
            </Text>

            <View className="bg-[#DCFCE7] px-3 py-1 rounded-full">
              <Text className="text-[#166534] text-xs font-medium">
                {parsedJob.payment}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text className="text-[#14532D] text-sm mb-4">
            {parsedJob.description}
          </Text>

          {/* META */}
          <View className="mb-4">
            <Text className="text-xs text-gray-600">
              Location: {parsedJob.location}
            </Text>
            <Text className="text-xs text-gray-600 mt-1">
              Duration: {parsedJob.totalTime}
            </Text>
          </View>

          {/* MAP BUTTON */}
          <TouchableOpacity
            onPress={openInMaps}
            className="border border-[#166534] py-3 rounded-full mb-4"
          >
            <Text className="text-center text-[#166534] font-medium">
              View on Map
            </Text>
          </TouchableOpacity>

          {/* APPLY BUTTON (ONLY FOR NON-ACCEPTED JOBS) */}
          {!parsedJob.isAccepted && (
            <TouchableOpacity
              disabled={applied}
              onPress={handleApply}
              className={`py-4 rounded-full ${
                applied ? "bg-gray-300" : "bg-[#166534]"
              }`}
            >
              <Text className="text-center text-white font-bold">
                {applied ? "Applied" : "Apply for Job"}
              </Text>
            </TouchableOpacity>
          )}

          {/* ACCEPTED BADGE */}
          {parsedJob.isAccepted && (
            <View className="bg-[#DCFCE7] py-3 rounded-full">
              <Text className="text-center text-[#14532D] font-semibold">
                Accepted Job
              </Text>
            </View>
          )}
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center justify-center gap-2"
        >
          <FontAwesome name="arrow-left" size={16} color="#14532D" />
          <Text className="text-[#14532D] font-medium">
            Back
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
