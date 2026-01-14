import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Switch,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api.service";

interface UserProfile {
  _id: string;
  name: string;
  phone: string;
  skills: string[];
  profileImage?: string;
  location?: string;
  availability?: string;
  currentMode: "employer" | "worker";
  rating?: {
    average: number;
    count: number;
  };
}

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingMode, setTogglingMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const response = await apiRequest<{ user: UserProfile }>("/users/profile");
      if (response.success && response.data?.user) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleToggleMode = async () => {
    if (!profile) return;

    setTogglingMode(true);
    const newMode = profile.currentMode === "employer" ? "worker" : "employer";

    try {
      const response = await apiRequest<{ user: UserProfile }>("/users/profile", {
        method: "PUT",
        body: JSON.stringify({ currentMode: newMode }),
      });

      if (response.success && response.data?.user) {
        setProfile(response.data.user);
        updateUser(response.data.user as any);
        Alert.alert("Mode Changed", `You are now in ${newMode} mode`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to change mode");
    } finally {
      setTogglingMode(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/Login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#F0FDF4] items-center justify-center">
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  const displayProfile = profile || user;

  return (
    <View className="flex-1 bg-[#F0FDF4]">
      <ScrollView
        className="flex-1 px-6 pt-14"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* PROFILE HEADER */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri:
                displayProfile?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayProfile?.name || "User"
                )}&background=166534&color=fff&size=150`,
            }}
            className="w-28 h-28 rounded-full mb-3"
          />
          <Text className="text-2xl font-bold text-[#14532D]">
            {displayProfile?.name || "User"}
          </Text>

          {/* RATING */}
          {profile?.rating && profile.rating.count > 0 && (
            <View className="flex-row items-center mt-1">
              <FontAwesome name="star" size={14} color="#EAB308" />
              <Text className="text-sm text-gray-600 ml-1">
                {profile.rating.average.toFixed(1)} ({profile.rating.count}{" "}
                reviews)
              </Text>
            </View>
          )}

          {/* MODE BADGE */}
          <View
            className={`mt-2 px-4 py-1 rounded-full ${
              profile?.currentMode === "employer"
                ? "bg-blue-100"
                : "bg-green-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                profile?.currentMode === "employer"
                  ? "text-blue-700"
                  : "text-green-700"
              }`}
            >
              {profile?.currentMode === "employer" ? "Employer" : "Worker"} Mode
            </Text>
          </View>
        </View>

        {/* MODE TOGGLE */}
        <View className="bg-[#cff5de] rounded-3xl p-4 mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <FontAwesome name="exchange" size={18} color="#166534" />
            <Text className="text-[#14532D] font-medium ml-3">
              Switch to {profile?.currentMode === "employer" ? "Worker" : "Employer"}
            </Text>
          </View>
          {togglingMode ? (
            <ActivityIndicator size="small" color="#166534" />
          ) : (
            <Switch
              value={profile?.currentMode === "employer"}
              onValueChange={handleToggleMode}
              trackColor={{ false: "#166534", true: "#3B82F6" }}
              thumbColor="white"
            />
          )}
        </View>

        {/* PROFILE DETAILS */}
        <View className="bg-[#cff5de] rounded-3xl p-6 mb-4">
          <ProfileItem
            icon="phone"
            label="Phone"
            value={displayProfile?.phone || "Not set"}
          />
          <ProfileItem
            icon="map-marker"
            label="Location"
            value={profile?.location || "Not set"}
          />
          <ProfileItem
            icon="clock-o"
            label="Availability"
            value={profile?.availability || "Not set"}
          />
        </View>

        {/* SKILLS */}
        <View className="bg-[#cff5de] rounded-3xl p-6 mb-4">
          <Text className="text-lg font-semibold text-[#14532D] mb-3">
            Skills
          </Text>

          {profile?.skills && profile.skills.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <View
                  key={skill}
                  className="bg-[#DCFCE7] px-4 py-2 rounded-full"
                >
                  <Text className="text-xs text-[#14532D]">{skill}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500">No skills added yet</Text>
          )}
        </View>

        {/* EDIT PROFILE BUTTON */}
        <TouchableOpacity
          onPress={() => router.push("/auth/user-details" as any)}
          className="bg-[#166534] py-4 rounded-full mb-4"
        >
          <Text className="text-center text-white font-bold">Edit Profile</Text>
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          className="border border-red-500 py-4 rounded-full mb-10"
        >
          <Text className="text-center text-red-500 font-bold">Logout</Text>
        </TouchableOpacity>
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

        <TouchableOpacity
          onPress={() => router.push("/jobs/explore")}
          className="w-16 h-16 rounded-2xl border border-[#14532D] items-center justify-center"
        >
          <FontAwesome name="search" size={22} color="#14532D" />
        </TouchableOpacity>

        <View className="w-16 h-16 rounded-2xl bg-[#14532D] items-center justify-center">
          <FontAwesome name="user" size={22} color="white" />
        </View>
      </View>
    </View>
  );
}

/* REUSABLE COMPONENT */
function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center mb-4">
      <FontAwesome
        name={icon}
        size={18}
        color="#166534"
        style={{ width: 26 }}
      />
      <View>
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-sm font-medium text-[#14532D]">{value}</Text>
      </View>
    </View>
  );
}
