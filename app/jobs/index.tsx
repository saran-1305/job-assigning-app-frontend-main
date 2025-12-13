// app/jobs/index.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export type Job = {
  id: string;
  title: string;
  description: string;
  status: "Open" | "Closed";
  // If you already have these, you can add/use them:
  // startTime?: string;
  // payment?: string;
  // location?: string;
  // totalTime?: string;
};

export default function JobsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    newJob?: string;
    updatedJob?: string;
  }>();

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Job 1",
      description:
        "Buy milk for neighbour from nearby shop and drop at their house.",
      status: "Open",
    },
    {
      id: "2",
      title: "Job 2",
      description: "Pick up child from school and drop at home safely.",
      status: "Open",
    },
  ]);

  // When coming from "Create Job" (new job)
  useEffect(() => {
    if (params.newJob) {
      try {
        const job: Job = JSON.parse(params.newJob as string);

        setJobs((prev) => {
          // avoid duplicates if user comes back with same job id
          if (prev.some((j) => j.id === job.id)) return prev;
          return [...prev, job];
        });
      } catch (e) {
        console.warn("Could not parse newJob", e);
      }
    }
  }, [params.newJob]);

  // When coming from "Edit Job" (updated job)
  useEffect(() => {
    if (params.updatedJob) {
      try {
        const job: Job = JSON.parse(params.updatedJob as string);

        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, ...job } : j))
        );
      } catch (e) {
        console.warn("Could not parse updatedJob", e);
      }
    }
  }, [params.updatedJob]);

  const handleEdit = (job: Job) => {
    router.push({
      pathname: "/jobs/create",
      params: {
        mode: "edit",
        job: JSON.stringify(job),
      },
    } as any);
  };

  const handleCancel = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: "Closed" } : j
      )
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* MAIN CONTENT */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 140,
        }}
      >
        <Text className="text-3xl font-bold text-[#111827] mb-6">
          Jobs Created
        </Text>

        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-[#F3F4F6] rounded-3xl p-5 mb-4"
          >
            {/* Title + status + Edit */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-[#111827]">
                {job.title}
              </Text>

              <View className="flex-row items-center">
                <View className="bg-[#E5E7EB] rounded-full px-4 py-1 mr-2">
                  <Text className="text-xs text-[#111827]">
                    {job.status}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleEdit(job)}
                  className="bg-[#111827] rounded-full px-4 py-1"
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
                className="flex-1 ml-3 bg-[#111827] rounded-full py-3 items-center"
                onPress={() => handleCancel(job.id)}
              >
                <Text className="text-sm text-white">Cancel Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAV BAR – black & white */}
      <View className="flex-row justify-around items-center bg-white border-t border-[#E5E7EB] py-3">
        {/* Add job */}
        <TouchableOpacity
          onPress={() => router.push("/jobs/create" as any)}
          className="w-16 h-16 rounded-2xl border border-[#111827] items-center justify-center"
        >
          <FontAwesome name="plus" size={22} color="#111827" />
        </TouchableOpacity>

        {/* Jobs (current) */}
        <View className="w-16 h-16 rounded-2xl bg-[#111827] items-center justify-center">
          <FontAwesome name="briefcase" size={22} color="#FFFFFF" />
        </View>

        {/* Profile (placeholder) */}
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
