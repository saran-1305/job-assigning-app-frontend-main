// app/jobs/create.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateJob() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    const newJob = {
      id: Date.now().toString(),
      title,
      description,
      status: "Open",
    };

    // Send to Jobs page
    router.push({
      pathname: "/jobs",
      params: { newJob: JSON.stringify(newJob) },
    });
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-[#111827] mt-10 mb-6">
        Add New Job
      </Text>

      {/* Title */}
      <Text className="text-gray-600 font-medium mb-1">Job Title</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="Enter job title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Desc */}
      <Text className="text-gray-600 font-medium mb-1">Description</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4 h-28"
        placeholder="Describe the job"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Submit */}
      <TouchableOpacity
        onPress={handleCreate}
        className="bg-[#111827] p-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center text-lg font-bold">
          Create Job
        </Text>
      </TouchableOpacity>
    </View>
  );
}
