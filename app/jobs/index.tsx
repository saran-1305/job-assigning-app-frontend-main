// app/jobs/index.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Job = {
  id: string;
  title: string;
  description: string;
  status: "Open" | "Closed";
};

export default function JobsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ newJob?: string }>();

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Job 1",
      description: "Buy milk for neighbour from nearby shop.",
      status: "Open",
    },
    {
      id: "2",
      title: "Job 2",
      description: "Pick up child from school and drop at home safely.",
      status: "Open",
    },
  ]);

  // REMOVE job 
  const handleCancel = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };


  // Create Job
-
  useEffect(() => {
    if (params.newJob) {
      const newJob: Job = JSON.parse(params.newJob);

      setJobs((prev) => {
        if (prev.some((j) => j.id === newJob.id)) return prev;
        return [...prev, newJob];
      });

      router.setParams({ newJob: undefined });
    }
  }, [params]);

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 140,
        }}
      >

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-[#111827]">
            Jobs Created
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/jobs/create")}
            className="bg-[#111827] w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-2xl leading-[28px]">+</Text>
          </TouchableOpacity>
        </View>

        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-[#F5F5F5] rounded-3xl p-5 mb-4"
          >
            <View className="flex-row justify-between items-center mb-2">

              <Text className="text-lg font-semibold text-[#111827]">
                {job.title}
              </Text>

              <View className="flex-row items-center gap-2">
                <View className="bg-[#E5E7EB] rounded-full px-4 py-1">
                  <Text className="text-xs text-[#111827]">
                    {job.status}
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-[#111827] rounded-full px-3 py-1"
                >
                  <Text className="text-xs text-white">Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-sm text-[#111827] mb-4">
              {job.description}
            </Text>

            <View className="flex-row justify-between mt-1">

              <TouchableOpacity className="flex-1 mr-3 bg-[#E5E7EB] rounded-full py-3 items-center">
                <Text className="text-sm text-[#111827]">
                  View Applicants
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCancel(job.id)}
                className="flex-1 ml-3 bg-[#111827] rounded-full py-3 items-center"
              >
                <Text className="text-sm text-white">Cancel Job</Text>
              </TouchableOpacity>

            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-around items-center bg-white py-3 border-t border-[#E5E7EB]">

        <TouchableOpacity
          onPress={() => router.push("/jobs/create")}
          className="w-16 h-16 rounded-2xl bg-[#111827] items-center justify-center"
        >
          <FontAwesome name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/jobs")}
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="briefcase" size={22} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#111827" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

