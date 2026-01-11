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
    <View className="flex-1 bg-[#FFF2E6]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 140,
        }}
      >
        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-textmain">
            Jobs Created
          </Text>

          {/* Top-right ➕ */}
          <TouchableOpacity
            onPress={() => router.push("/jobs/create")}
            className="bg-accent w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-2xl leading-[28px]">+</Text>
          </TouchableOpacity>
        </View>

        {/* JOB LIST */}
        {jobs.map((job) => (
          <View
            key={job.id}
            className="bg-card rounded-3xl p-5 mb-4"
          >
            {/* Title + Status + Edit */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-textmain">
                {job.title}
              </Text>

              <View className="flex-row items-center gap-2">
                <View className="bg-bgmain rounded-full px-4 py-1">
                  <Text className="text-xs text-textmain">
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
                  className="bg-textmain rounded-full px-3 py-1"
                >
                  <Text className="text-xs text-white">Edit</Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* Description */}
            <Text className="text-sm text-textmain mb-4">
              {job.description}
            </Text>

            {/* Buttons */}
            <View className="flex-row justify-between mt-1">
              <TouchableOpacity className="flex-1 mr-3 bg-bgmain rounded-full py-3 items-center">
                <Text className="text-sm text-textmain">
                  View Applicants
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => cancelJob(job.id)}
                className="flex-1 ml-3 bg-textmain rounded-full py-3 items-center"
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
      <View className="flex-row justify-around items-center bg-bgmain border-t border-card py-3">

        {/* CURRENT SCREEN */}
        <View className="w-16 h-16 rounded-2xl bg-textmain items-center justify-center">
          <FontAwesome name="plus" size={22} color="white" />
        </View>

        {/* Briefcase */}
        <TouchableOpacity onPress={() => router.push("/jobs/jobapplication")} className="w-16 h-16 rounded-2xl border border-textmain items-center justify-center">
          <FontAwesome name="briefcase" size={22} color="textmain" />
        </TouchableOpacity>
        {/* Explore */}
        <TouchableOpacity
        onPress={() => router.push("/jobs/explore")}
        className="w-16 h-16 rounded-2xl border border-textmain items-center justify-center"
        >
        <FontAwesome name="search" size={22} color="textmain" />
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
        onPress={() => router.push("/profile")}
          className="w-16 h-16 rounded-2xl border border-textmain items-center justify-center"
        >
          <FontAwesome name="user" size={22} color="textmain" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
