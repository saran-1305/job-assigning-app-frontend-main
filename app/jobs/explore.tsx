import React, { useState, useCallback } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { 
  getSkillPosts, 
  requestSkill, 
  SkillPost 
} from "../../services/skillPost.service";
import { useAuth } from "../../context/AuthContext";

export default function ExploreScreen() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<SkillPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchSkillPosts();
    }, [])
  );

  const fetchSkillPosts = async () => {
    try {
      const response = await getSkillPosts();
      if (response.success && response.data?.skillPosts) {
        setSkills(response.data.skillPosts);
      }
    } catch (error) {
      console.error("Failed to fetch skill posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSkillPosts();
  };

  const handleRequestJob = async (skillPost: SkillPost) => {
    setRequestingId(skillPost.id);
    try {
      const response = await requestSkill(skillPost.id);
      if (response.success) {
        Alert.alert(
          "Job Requested",
          `Your request for ${skillPost.skill} has been sent to ${skillPost.userId.name}`
        );
      } else {
        Alert.alert("Error", (response as any).message || "Failed to send request");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setRequestingId(null);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#F0FDF4] items-center justify-center">
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F0FDF4]">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View className="mt-10 mb-6">
          <Text className="text-[#14532D] text-xl">Welcome,</Text>
          <Text className="text-[#14532D] text-3xl font-bold">
            {user?.name || "User"}
          </Text>
          <Text className="text-[#14532D] text-xl text-center font-bold mt-4">
            Explore Skills
          </Text>
        </View>

        {/* NO SKILLS */}
        {skills.length === 0 && (
          <View className="items-center py-10">
            <FontAwesome name="search" size={48} color="#ccc" />
            <Text className="text-gray-500 mt-4 text-center">
              No skill posts yet.{"\n"}Check back later!
            </Text>
          </View>
        )}

        {/* SKILL CARDS */}
        {skills.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-3xl border border-[#DCFCE7] mb-5 overflow-hidden"
          >
            {/* IMAGE */}
            {item.photo && (
              <Image
                source={{ uri: item.photo }}
                className="w-full h-44"
                resizeMode="cover"
              />
            )}

            {/* CONTENT */}
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-[#14532D] text-lg font-semibold">
                    {item.skill}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {item.userId.name}
                  </Text>
                </View>

                {item.userId.rating && (
                  <View className="flex-row items-center bg-[#DCFCE7] px-2 py-1 rounded-full">
                    <FontAwesome name="star" size={12} color="#EAB308" />
                    <Text className="text-xs text-[#166534] ml-1">
                      {item.userId.rating.average?.toFixed(1) || "New"}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-sm text-gray-600 mt-3">
                {item.description}
              </Text>

              {item.stats && (
                <View className="flex-row mt-2">
                  <Text className="text-xs text-gray-400">
                    {item.stats.views} views • {item.stats.requests} requests
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => handleRequestJob(item)}
                disabled={requestingId === item.id}
                className={`mt-4 py-3 rounded-xl ${
                  requestingId === item.id ? "bg-gray-300" : "bg-[#14532D]"
                }`}
              >
                {requestingId === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-medium">
                    Request Job
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View className="flex-row justify-around items-center bg-[#F0FDF4] border-t border-[#DCFCE7] py-3">
        <TouchableOpacity
          onPress={() => router.push("/jobs")}
          className="w-16 h-16 rounded-2xl border border-[#14532D] items-center justify-center"
        >
          <FontAwesome name="plus" size={22} color="#14532D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/jobs/availablejobs")}
          className="w-16 h-16 rounded-2xl border border-[#14532D] items-center justify-center"
        >
          <FontAwesome name="briefcase" size={22} color="#14532D" />
        </TouchableOpacity>

        <View className="w-16 h-16 rounded-2xl bg-[#14532D] items-center justify-center">
          <FontAwesome name="search" size={22} color="white" />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="w-16 h-16 rounded-2xl border border-[#14532D] items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#14532D" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
