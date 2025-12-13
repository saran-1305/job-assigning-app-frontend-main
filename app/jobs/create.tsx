// app/jobs/create.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";

export default function CreateJob() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");      // e.g. "Today 5:00 PM"
  const [payment, setPayment] = useState("");          // e.g. "₹300"
  const [jobLocation, setJobLocation] = useState("");  // text address
  const [totalTime, setTotalTime] = useState("");      // e.g. "2 hours"
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !startTime.trim() ||
      !payment.trim() ||
      !jobLocation.trim() ||
      !totalTime.trim()
    ) {
      Alert.alert("Missing Fields", "Please fill all the fields.");
      return;
    }

    setCreating(true);

    // Try to convert the address into coordinates (optional)
    let coordinates: { latitude: number; longitude: number } | null = null;
    try {
      const results = await Location.geocodeAsync(jobLocation.trim());
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        coordinates = { latitude, longitude };
      }
    } catch (err) {
      console.log("Geocoding failed (will still save job):", err);
      // We just skip coordinates if geocoding fails
    }
    console.log("JOB LOCATION:", jobLocation.trim(), coordinates);

    const newJob = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      startTime: startTime.trim(),
      payment: payment.trim(),
      location: jobLocation.trim(),   // text location
      totalTime: totalTime.trim(),
      coordinates,                    // { lat, lng } or null
      status: "Open",
    };

    setCreating(false);

    // Send job object to Jobs page
    router.push({
      pathname: "/jobs",
      params: { newJob: JSON.stringify(newJob) },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-[#111827] mb-8">
        Add New Job
      </Text>

      {/* Job title */}
      <Text className="text-gray-700 font-medium mb-1">Job Title</Text>
      <TextInput
        className="bg-[#E5E7EB] rounded-xl px-4 py-3 mb-4"
        placeholder="Enter job title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text className="text-gray-700 font-medium mb-1">Description</Text>
      <TextInput
        className="bg-[#E5E7EB] rounded-xl px-4 py-3 mb-4 h-32"
        placeholder="Describe the job"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Starting time */}
      <Text className="text-gray-700 font-medium mb-1">Starting time</Text>
      <TextInput
        className="bg-[#E5E7EB] rounded-xl px-4 py-3 mb-4"
        placeholder="Eg. Today 5:00 PM"
        value={startTime}
        onChangeText={setStartTime}
      />

      {/* Payment */}
      <Text className="text-gray-700 font-medium mb-1">payment</Text>
      <TextInput
        className="bg-[#E5E7EB] rounded-xl px-4 py-3 mb-4"
        placeholder="Eg. ₹300"
        keyboardType="numeric"
        value={payment}
        onChangeText={setPayment}
      />

      {/* Location (any place, not just current) */}
      <Text className="text-gray-700 font-medium mb-1">Location</Text>
      <TextInput
        className="bg-[#E5E7EB] rounded-xl px-4 py-3 mb-4"
        placeholder="Eg. T. Nagar, Chennai"
        value={jobLocation}
        onChangeText={setJobLocation}
      />

      {/* Total time */}
      <Text className="text-gray-700 font-medium mb-1">Total time</Text>
      <TextInput
        className="bg-[#E5E7EB] rounded-xl px-4 py-3 mb-6"
        placeholder="Eg. 2 hours"
        value={totalTime}
        onChangeText={setTotalTime}
      />

      {/* Create button */}
      <TouchableOpacity
        onPress={handleCreate}
        disabled={creating}
        className="bg-[#111827] rounded-xl py-4"
      >
        <Text className="text-white text-center text-lg font-bold">
          {creating ? "Creating..." : "Create Job"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
