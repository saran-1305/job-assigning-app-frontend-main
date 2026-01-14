import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { getJobById, applyForJob, Job } from "../../services/job.service";

export default function JobDetailsScreen() {
  const { jobId, isAccepted } = useLocalSearchParams<{
    jobId: string;
    isAccepted?: string;
  }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    } else {
      setLoading(false);
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await getJobById(jobId!);
      if (response.success && response.data?.job) {
        setJob(response.data.job);
        setApplied(response.data.job.hasApplied || false);
      }
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;

    setApplying(true);
    try {
      const response = await applyForJob(job.id);
      if (response.success) {
        setApplied(true);
        Alert.alert("Applied", "You have successfully applied for this job.");
      } else {
        Alert.alert("Error", (response as any).message || "Failed to apply");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  const openInMaps = () => {
    if (!job) return;
    const query = encodeURIComponent(job.locationText || "");
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${query}`
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F0FDF4]">
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F0FDF4]">
        <Text className="text-[#14532D]">No job data found</Text>
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

  const isJobAccepted = isAccepted === "true";

  return (
    <View className="flex-1 bg-[#F0FDF4]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {/* HEADER */}
        <View className="mb-6 mt-10">
          <Text className="text-[#14532D] text-3xl font-bold">Job Details</Text>
        </View>

        {/* JOB CARD */}
        <View className="bg-white rounded-3xl border border-[#DCFCE7] p-5 mb-6">
          {/* TITLE + PAYMENT */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-[#14532D] text-xl font-semibold flex-1 mr-3">
              {job.title}
            </Text>

            <View className="bg-[#DCFCE7] px-3 py-1 rounded-full">
              <Text className="text-[#166534] text-xs font-medium">
                {job.payment}
              </Text>
            </View>
          </View>

          {/* STATUS BADGE */}
          <View className="flex-row mb-3">
            <View
              className={`px-3 py-1 rounded-full ${
                job.status === "Open"
                  ? "bg-green-100"
                  : job.status === "Closed"
                  ? "bg-gray-100"
                  : "bg-red-100"
              }`}
            >
              <Text
                className={`text-xs ${
                  job.status === "Open"
                    ? "text-green-700"
                    : job.status === "Closed"
                    ? "text-gray-700"
                    : "text-red-700"
                }`}
              >
                {job.status}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text className="text-[#14532D] text-sm mb-4">{job.description}</Text>

          {/* META */}
          <View className="mb-4">
            <Text className="text-xs text-gray-600">
              Location: {job.locationText}
            </Text>
            <Text className="text-xs text-gray-600 mt-1">
              Duration: {job.totalTime || "Flexible"}
            </Text>
            {job.startTime && (
              <Text className="text-xs text-gray-600 mt-1">
                Start: {new Date(job.startTime).toLocaleString()}
              </Text>
            )}
          </View>

          {/* EMPLOYER INFO */}
          {job.createdBy && (
            <View className="bg-[#F0FDF4] p-3 rounded-2xl mb-4">
              <Text className="text-xs text-gray-500 mb-1">Posted by</Text>
              <Text className="text-[#14532D] font-medium">
                {job.createdBy.name || "Unknown"}
              </Text>
              {job.createdBy.rating && (
                <View className="flex-row items-center mt-1">
                  <FontAwesome name="star" size={12} color="#EAB308" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {typeof job.createdBy.rating === "object"
                      ? (job.createdBy.rating as any).average?.toFixed(1)
                      : job.createdBy.rating}
                  </Text>
                </View>
              )}
            </View>
          )}

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
          {!isJobAccepted && job.status === "Open" && (
            <TouchableOpacity
              disabled={applied || applying}
              onPress={handleApply}
              className={`py-4 rounded-full ${
                applied ? "bg-gray-300" : "bg-[#166534]"
              }`}
            >
              {applying ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-center text-white font-bold">
                  {applied ? "Applied" : "Apply for Job"}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {/* ACCEPTED BADGE */}
          {isJobAccepted && (
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
          <Text className="text-[#14532D] font-medium">Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
