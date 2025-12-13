import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export type Job = {
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
      title: "Job",
      description:
        "Buy milk for neighbour from nearby shop and drop at their house.",
      status: "Open",
    },
    {
      id: "2",
      title: "Job",
      description:
        "Pick up child from school and drop at home safely.",
      status: "Open",
    },
  ]);

  // Add new job from Create Job screen
  useEffect(() => {
    if (params.newJob) {
      const job: Job = JSON.parse(params.newJob);
      setJobs((prev) =>
        prev.some((j) => j.id === job.id) ? prev : [...prev, job]
      );
    }
  }, [params.newJob]);

  // Cancel job
  const cancelJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 140,
        }}
      >
        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-[#111827]">
            Jobs Created
          </Text>

          {/* Top-right ➕ */}
          <TouchableOpacity
            onPress={() => router.push("/jobs/create")}
            className="bg-[#111827] w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-2xl leading-[28px]">+</Text>
          </TouchableOpacity>
        </View>

        {/* JOB LIST */}
        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-[#F3F4F6] rounded-3xl p-5 mb-4"
          >
            {/* Title + Status + Edit */}
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
                  onPress={() =>
                    router.push({
                      pathname: "/jobs/create",
                      params: {
                        mode: "edit",
                        job: JSON.stringify(job),
                      },
                    })
                  }
                  className="bg-[#111827] rounded-full px-3 py-1"
                >
                  <Text className="text-xs text-white">Edit</Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* Description */}
            <Text className="text-sm text-[#111827] mb-4">
              {job.description}
            </Text>

            {/* Buttons */}
            <View className="flex-row justify-between mt-1">
              <TouchableOpacity className="flex-1 mr-3 bg-[#E5E7EB] rounded-full py-3 items-center">
                <Text className="text-sm text-[#111827]">
                  View Applicants
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => cancelJob(job.id)}
                className="flex-1 ml-3 bg-[#111827] rounded-full py-3 items-center"
              >
                <Text className="text-sm text-white">
                  Cancel Job
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAVBAR */}
      <View className="flex-row justify-around items-center bg-white border-t border-[#E5E7EB] py-3">

        {/* CURRENT SCREEN */}
        <View className="w-16 h-16 rounded-2xl bg-[#111827] items-center justify-center">
          <FontAwesome name="plus" size={22} color="#FFFFFF" />
        </View>

        {/* Briefcase */}
        <TouchableOpacity onPress={() => router.push("/jobs/jobapplication")} className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center">

          <FontAwesome name="briefcase" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          //onPress={() => router.push("/profile")}
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
