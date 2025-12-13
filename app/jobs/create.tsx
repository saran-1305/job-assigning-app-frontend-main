// app/jobs/create.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

export default function CreateJob() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startTime, setStartTime] = useState("");
  const [payment, setPayment] = useState("");
  const [totalTime, setTotalTime] = useState("");

  const [locationText, setLocationText] = useState("");
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null);

  // Ask for permission once when this screen opens
  useEffect(() => {
    (async () => {
      const existing = await Location.getForegroundPermissionsAsync();

      if (existing.status !== "granted") {
        const requested = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(requested.status);

        if (requested.status !== "granted") {
          console.log("Location permission NOT granted yet");
        }
      } else {
        setLocationPermission(existing.status);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !startTime.trim() ||
      !payment.trim() ||
      !totalTime.trim() ||
      !locationText.trim()
    ) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    let coords: { latitude: number; longitude: number } | null = null;

    try {
      let status = locationPermission;

      // If we still don't have permission, try again here
      if (status !== "granted") {
        const requested = await Location.requestForegroundPermissionsAsync();
        status = requested.status;
        setLocationPermission(status);
      }

      if (status === "granted") {
        const results = await Location.geocodeAsync(locationText);
        if (results && results.length > 0) {
          coords = {
            latitude: results[0].latitude,
            longitude: results[0].longitude,
          };
        } else {
          console.log("Geocode returned empty array for:", locationText);
        }
      } else {
        Alert.alert(
          "Location permission not granted",
          "We will only save the text address. To save a map pin, please allow location access for Expo Go in your phone settings."
        );
      }
    } catch (err) {
      console.log("Geocoding failed (will still save job):", err);
    }

    const newJob = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      startTime: startTime.trim(),
      payment: payment.trim(),
      totalTime: totalTime.trim(),
      location: {
        address: locationText.trim(),
        coords, // may be null if permission/geocode failed
      },
      status: "Open",
    };

    console.log("JOB LOCATION:", locationText, coords);

    // Send to Jobs page
    router.push({
      pathname: "/jobs",
      params: { newJob: JSON.stringify(newJob) },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold text-[#111827] mb-8">
        Add New Job
      </Text>

      {/* Job title */}
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
      <Text className="text-gray-600 font-medium mb-1">Starting time</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="e.g. Today 5:30 PM"
        value={startTime}
        onChangeText={setStartTime}
      />

      {/* Payment */}
      <Text className="text-gray-600 font-medium mb-1">payment</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="e.g. ₹200"
        keyboardType="numeric"
        value={payment}
        onChangeText={setPayment}
      />

      {/* Location (typed address → geocoded) */}
      <Text className="text-gray-600 font-medium mb-1">Location</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-4"
        placeholder="Street, area, city…"
        value={locationText}
        onChangeText={setLocationText}
      />

      {/* Total time */}
      <Text className="text-gray-600 font-medium mb-1">Total time</Text>
      <TextInput
        className="bg-[#E5E7EB] p-3 rounded-xl mb-6"
        placeholder="e.g. 1 hour"
        value={totalTime}
        onChangeText={setTotalTime}
      />

      <TouchableOpacity
        className="bg-[#111827] p-4 rounded-xl"
        onPress={handleCreate}
      >
        <Text className="text-white text-center text-lg font-bold">
          Create Job
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
