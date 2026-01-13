import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Job = {
  id: string;
  title: string;
  description: string;
  payment: string;
  location: string;
  totalTime: string;
  isAccepted?: boolean; // 👈 added
};

export default function AvailableJobsScreen() {

  const goToJobDetails = (job: Job) => {
    router.push({
      pathname: "/jobs/jobdetails",
      params: {
        job: JSON.stringify(job),
      },
    });
  };

  return (
    <View className="flex-1 bg-[#F0FDF4]">
      {/* HEADER */}
      <View className="px-6 pt-14">
        <Text className="text-[#14532D] text-xl">Welcome,</Text>
        <Text className="text-[#14532D] text-3xl font-bold">Name</Text>
      </View>

      {/* ACCEPTED JOBS */}
      <View className="px-6 mt-6">
        <Text className="text-[#166534] text-lg mb-3">
          Accepted jobs
        </Text>

        {/* Card 1 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            goToJobDetails({
              id: "1",
              title: "Buy Groceries",
              description: "Buy groceries and deliver to elderly neighbour.",
              payment: "₹250",
              location: "Anna Nagar",
              totalTime: "1 hour",
              isAccepted: true, // ✅
            })
          }
        >
          <View className="bg-white rounded-3xl border border-[#DCFCE7] p-4 mb-3">
            <Text className="text-[#14532D] font-semibold">
              Buy Groceries
            </Text>
            <Text className="text-xs text-gray-600">
              Anna Nagar • 1 hour
            </Text>
          </View>
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            goToJobDetails({
              id: "2",
              title: "Dog Walking",
              description: "Walk dog in the evening for 30 minutes.",
              payment: "₹150",
              location: "T Nagar",
              totalTime: "30 mins",
              isAccepted: true, // ✅
            })
          }
        >
          <View className="bg-white rounded-3xl border border-[#DCFCE7] p-4">
            <Text className="text-[#14532D] font-semibold">
              Dog Walking
            </Text>
            <Text className="text-xs text-gray-600">
              T Nagar • 30 mins
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* JOB REQUESTS */}
      <View className="px-6 mt-8 flex-1">
        <Text className="text-[#166534] text-lg mb-3">
          Job requests
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Request 1 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              goToJobDetails({
                id: "3",
                title: "House Cleaning",
                description: "Basic house cleaning work.",
                payment: "₹500",
                location: "Velachery",
                totalTime: "2 hours",
                isAccepted: false, // ❌ not accepted yet
              })
            }
          >
            <View className="bg-white rounded-3xl border border-[#DCFCE7] p-4 mb-4">
              <Text className="text-[#14532D] font-semibold">
                House Cleaning
              </Text>
              <Text className="text-xs text-gray-600 mb-4">
                Velachery • 2 hours • ₹500
              </Text>

              <View className="flex-row gap-3">
                <View className="flex-1 bg-[#166534] py-2 rounded-full">
                  <Text className="text-center text-white font-medium">
                    Accept
                  </Text>
                </View>

                <View className="flex-1 border border-[#166534] py-2 rounded-full">
                  <Text className="text-center text-[#166534] font-medium">
                    Reject
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Request 2 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              goToJobDetails({
                id: "4",
                title: "Babysitting",
                description: "Evening babysitting required.",
                payment: "₹400",
                location: "Adyar",
                totalTime: "Evening",
                isAccepted: false, // ❌
              })
            }
          >
            <View className="bg-white rounded-3xl border border-[#DCFCE7] p-4 mb-4">
              <Text className="text-[#14532D] font-semibold">
                Babysitting
              </Text>
              <Text className="text-xs text-gray-600 mb-4">
                Adyar • Evening
              </Text>

              <View className="flex-row gap-3">
                <View className="flex-1 bg-[#166534] py-2 rounded-full">
                  <Text className="text-center text-white">
                    Accept
                  </Text>
                </View>

                <View className="flex-1 border border-[#166534] py-2 rounded-full">
                  <Text className="text-center text-[#166534]">
                    Reject
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* BOTTOM NAV */}
      <View className="flex-row justify-around items-center bg-[#F0FDF4] border-t border-[#DCFCE7] py-3">

        <TouchableOpacity
          onPress={() => router.push("/jobs")}
          className="w-16 h-16 rounded-2xl border border-[#14532D] items-center justify-center"
        >
          <FontAwesome name="plus" size={22} color="#14532D" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/jobs/jobapplication")}
          className="w-16 h-16 rounded-2xl bg-[#14532D] items-center justify-center"
        >
          <FontAwesome name="briefcase" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/jobs/explore")}
          className="w-16 h-16 rounded-2xl border border-[#14532D] items-center justify-center"
        >
          <FontAwesome name="search" size={22} color="#14532D" />
        </TouchableOpacity>

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
