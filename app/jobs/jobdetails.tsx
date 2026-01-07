// app/jobs/jobdetails.tsx
import { useLocalSearchParams } from "expo-router";
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
};

export default function JobDetailsScreen() {
  const { job } = useLocalSearchParams<{ job: string }>();

  if (!job) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-[#111827]">No job data found.</Text>
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
    if (!parsedJob.location) return;
    const query = encodeURIComponent(parsedJob.location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 24, paddingTop: 50, paddingBottom: 40 }}
    >
      {/* Title */}
      <Text className="text-3xl font-bold text-[#111827] mb-4">
        {parsedJob.title}
      </Text>

      {/* Payment */}
      <View className="bg-[#E5E7EB] self-start px-4 py-1 rounded-full mb-4">
        <Text className="text-sm text-[#111827]">
          {parsedJob.payment}
        </Text>
      </View>

      {/* Description */}
      <Text className="text-base text-[#111827] mb-6">
        {parsedJob.description}
      </Text>

      {/* Details */}
      <View className="mb-6">
        <Text className="text-sm text-gray-600 mb-2">
          Location: {parsedJob.location}
        </Text>
        <Text className="text-sm text-gray-600">
          Duration: {parsedJob.totalTime}
        </Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        disabled={applied}
        onPress={handleApply}
        className={`rounded-xl py-4 items-center mb-3 ${applied ? "bg-gray-400" : "bg-[#111827]"
          }`}
      >
        <Text className="text-white font-bold text-lg">
          {applied ? "Applied" : "Apply for Job"}
        </Text>
      </TouchableOpacity>

      {/* Open in Google Maps Button */}
      <TouchableOpacity
        onPress={openInMaps}
        className="flex-row items-center justify-center gap-2 rounded-xl border border-[#111827] py-4"
      >
        <Text className=""
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#111827",
            includeFontPadding: false,
          }}
        >
          Open in Google Maps
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
