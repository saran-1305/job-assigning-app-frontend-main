// app/jobs/index.tsx
import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function JobsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      {/* Main content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 140, // space so last card not hidden behind nav
        }}
      >
        <Text className="text-3xl font-bold text-[#111827] mb-6">
          Jobs Created
        </Text>

        {/* Job card 1 */}
        <View className="bg-[#F5F5F5] rounded-3xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-[#111827]">Job 1</Text>
            <View className="bg-[#E5E7EB] rounded-full px-4 py-1">
              <Text className="text-xs text-[#111827]">Open</Text>
            </View>
          </View>

          <Text className="text-sm text-[#111827] mb-4">
            Buy milk for neighbour from nearby shop and drop at their house.
          </Text>

          <View className="flex-row justify-between mt-1">
            <TouchableOpacity className="flex-1 mr-3 bg-[#E5E7EB] rounded-full py-3 items-center">
              <Text className="text-sm text-[#111827]">View Applicants</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 ml-3 bg-[#111827] rounded-full py-3 items-center">
              <Text className="text-sm text-[#FFFFFF]">Cancel Job</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job card 2 */}
        <View className="bg-[#F5F5F5] rounded-3xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-[#111827]">Job 2</Text>
            <View className="bg-[#E5E7EB] rounded-full px-4 py-1">
              <Text className="text-xs text-[#111827]">Open</Text>
            </View>
          </View>

          <Text className="text-sm text-[#111827] mb-4">
            Pick up child from school and drop at home safely.
          </Text>

          <View className="flex-row justify-between mt-1">
            <TouchableOpacity className="flex-1 mr-3 bg-[#E5E7EB] rounded-full py-3 items-center">
              <Text className="text-sm text-[#111827]">View Applicants</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 ml-3 bg-[#111827] rounded-full py-3 items-center">
              <Text className="text-sm text-[#FFFFFF]">Cancel Job</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Empty placeholders */}
        <View className="bg-[#F5F5F5] rounded-3xl h-40 mb-4" />
        <View className="bg-[#F5F5F5] rounded-3xl h-40" />
      </ScrollView>

      {/* Bottom navigation bar (black & white) */}
      <View className="flex-row justify-around items-center bg-[#FFFFFF] py-3 border-t border-[#E5E7EB]">
        {/* Add job */}
        <TouchableOpacity
          onPress={() => router.push("/jobs/create" as any)}
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="plus" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Jobs (current) */}
        <TouchableOpacity
          onPress={() => router.push("/jobs" as any)}
          className="w-16 h-16 rounded-2xl bg-[#111827] items-center justify-center"
        >
          <FontAwesome name="briefcase" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Profile (placeholder route for now) */}
        <TouchableOpacity
          onPress={() => router.push("/profile" as any)}
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
