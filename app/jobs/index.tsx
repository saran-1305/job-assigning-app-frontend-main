import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from "react-native";
import { getMyJobs, cancelJob as cancelJobAPI, Job } from "../../services/job.service";
import { useAuth } from "../../context/AuthContext";

export default function JobsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch jobs on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );

  const fetchJobs = async () => {
    try {
      const response = await getMyJobs();
      if (response.success && response.data?.jobs) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  // Cancel job
  const handleCancelJob = (jobId: string) => {
    Alert.alert(
      "Cancel Job",
      "Are you sure you want to cancel this job?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await cancelJobAPI(jobId);
              if (response.success) {
                setJobs((prev) => prev.filter((job) => job.id !== jobId));
                Alert.alert("Success", "Job cancelled successfully");
              } else {
                Alert.alert("Error", "Failed to cancel job");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FFF2E6] items-center justify-center">
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFF2E6]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 140,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-lg text-textmuted">Welcome, {user?.name || 'User'}</Text>
            <Text className="text-3xl font-bold text-textmain">
              Jobs Created
            </Text>
          </View>

          {/* Top-right ➕ */}
          <TouchableOpacity
            onPress={() => router.push("/jobs/create")}
            className="bg-accent w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-2xl leading-[28px]">+</Text>
          </TouchableOpacity>
        </View>

        {/* EMPTY STATE */}
        {jobs.length === 0 && (
          <View className="items-center py-10">
            <FontAwesome name="briefcase" size={48} color="#ccc" />
            <Text className="text-textmuted mt-4 text-center">
              No jobs created yet.{"\n"}Tap + to create your first job!
            </Text>
          </View>
        )}

        {/* JOB LIST */}
        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-card rounded-3xl p-5 mb-4"
          >
            {/* Title + Status + Edit */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-textmain flex-1">
                {job.title}
              </Text>

              <View className="flex-row items-center gap-2">
                <View className={`rounded-full px-4 py-1 ${
                  job.status === 'Open' ? 'bg-green-100' : 
                  job.status === 'InProgress' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Text className={`text-xs ${
                    job.status === 'Open' ? 'text-green-700' :
                    job.status === 'InProgress' ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {job.status}
                  </Text>
                </View>

                {job.status === 'Open' && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/jobs/create",
                        params: {
                          mode: "edit",
                          jobId: job.id,
                        },
                      })
                    }
                    className="bg-textmain rounded-full px-3 py-1"
                  >
                    <Text className="text-xs text-white">Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Description */}
            <Text className="text-sm text-textmain mb-2" numberOfLines={2}>
              {job.description}
            </Text>

            {/* Payment & Location */}
            <View className="flex-row gap-4 mb-4">
              <Text className="text-xs text-textmuted">💰 {job.payment}</Text>
              <Text className="text-xs text-textmuted">📍 {job.locationText}</Text>
              {job.applicantCount !== undefined && job.applicantCount > 0 && (
                <Text className="text-xs text-textmuted">👥 {job.applicantCount} applicants</Text>
              )}
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between mt-1">
              <TouchableOpacity 
                className="flex-1 mr-3 bg-bgmain rounded-full py-3 items-center"
                onPress={() => router.push({
                  pathname: "/jobs/applicants",
                  params: { jobId: job.id, jobTitle: job.title }
                } as any)}
              >
                <Text className="text-sm text-textmain">
                  View Applicants
                </Text>
              </TouchableOpacity>

              {job.status === 'Open' && (
                <TouchableOpacity
                  onPress={() => handleCancelJob(job.id)}
                  className="flex-1 ml-3 bg-textmain rounded-full py-3 items-center"
                >
                  <Text className="text-sm text-white">
                    Cancel Job
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View className="flex-row justify-around items-center bg-bgmain border-t border-card py-3">
        {/* CURRENT SCREEN */}
        <View className="w-16 h-16 rounded-2xl bg-textmain items-center justify-center">
          <FontAwesome name="plus" size={22} color="white" />
        </View>

        {/* Briefcase */}
        <TouchableOpacity 
          onPress={() => router.push("/jobs/availablejobs")} 
          className="w-16 h-16 rounded-2xl border border-textmain items-center justify-center"
        >
          <FontAwesome name="briefcase" size={22} color="#111827" />
        </TouchableOpacity>
        
        {/* Explore */}
        <TouchableOpacity
          onPress={() => router.push("/jobs/explore")}
          className="w-16 h-16 rounded-2xl border border-textmain items-center justify-center"
        >
          <FontAwesome name="search" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="w-16 h-16 rounded-2xl border border-textmain items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
