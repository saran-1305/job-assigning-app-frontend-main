// app/jobs/create.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateJob() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startTime, setStartTime] = useState("");
  const [payment, setPayment] = useState("");
  const [location, setLocation] = useState("");
  const [totalTime, setTotalTime] = useState("");

  const handleCreate = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !startTime.trim() ||
      !payment.trim() ||
      !location.trim() ||
      !totalTime.trim()
    ) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    const newJob = {
      id: Date.now().toString(),
      title,
      description,
      startTime,
      payment,
      location,
      totalTime,
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

      {/* Job Title */}
      <Text className="text-gray-600 font-medium mb-1">Job Title</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="Enter job title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text className="text-gray-600 font-medium mb-1">Description</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4 h-28"
        placeholder="Describe the job"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Starting time */}
      <Text className="text-gray-600 font-medium mb-1">Starting Time</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="e.g., 5:00 PM"
        value={startTime}
        onChangeText={setStartTime}
      />

      {/* Total time */}
      <Text className="text-gray-600 font-medium mb-1">Total Time</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="e.g., 2 hours"
        value={totalTime}
        onChangeText={setTotalTime}
      />

      {/* Location */}
      <Text className="text-gray-600 font-medium mb-1">Location</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="Where the job is"
        value={location}
        onChangeText={setLocation}
      />

      {/* Payment */}
      <Text className="text-gray-600 font-medium mb-1">payment</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="e.g., ₹300"
        keyboardType="numeric"
        value={payment}
        onChangeText={setPayment}
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
