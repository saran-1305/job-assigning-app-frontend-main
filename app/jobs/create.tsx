// app/jobs/create.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { createJob, updateJob, getJobById } from "../../services/job.service";

type Params = {
  mode?: string; // "create" | "edit"
  jobId?: string;
};

type JobFormState = {
  title: string;
  description: string;
  startTime: string;
  payment: string;
  locationText: string;
  totalTime: string;
};

export default function CreateJob() {
  const router = useRouter();
  const { mode, jobId } = useLocalSearchParams<Params>();
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);

  const [form, setForm] = useState<JobFormState>({
    title: "",
    description: "",
    startTime: "",
    payment: "",
    locationText: "",
    totalTime: "",
  });

  // Fetch job data when editing
  useEffect(() => {
    if (isEdit && jobId) {
      fetchJobData();
    }
  }, [isEdit, jobId]);

  const fetchJobData = async () => {
    if (!jobId) return;
    
    setFetchingJob(true);
    try {
      const response = await getJobById(jobId);
      if (response.success && response.data?.job) {
        const job = response.data.job;
        setForm({
          title: job.title || "",
          description: job.description || "",
          startTime: job.startTime || "",
          payment: job.payment || "",
          locationText: job.locationText || "",
          totalTime: job.totalTime || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch job:", error);
      Alert.alert("Error", "Failed to load job data");
    } finally {
      setFetchingJob(false);
    }
  };

  const updateField = (key: keyof JobFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      Alert.alert("Missing Fields", "Please fill at least title and description.");
      return;
    }

    if (!form.payment.trim()) {
      Alert.alert("Missing Fields", "Please enter payment information.");
      return;
    }

    if (!form.locationText.trim()) {
      Alert.alert("Missing Fields", "Please enter location.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEdit && jobId) {
        response = await updateJob(jobId, {
          title: form.title.trim(),
          description: form.description.trim(),
          startTime: form.startTime.trim(),
          payment: form.payment.trim(),
          locationText: form.locationText.trim(),
          totalTime: form.totalTime.trim(),
        } as any);
      } else {
        response = await createJob({
          title: form.title.trim(),
          description: form.description.trim(),
          startTime: form.startTime.trim(),
          payment: form.payment.trim(),
          locationText: form.locationText.trim(),
          totalTime: form.totalTime.trim(),
        });
      }

      if (response.success) {
        Alert.alert(
          "Success",
          isEdit ? "Job updated successfully" : "Job created successfully",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("Error", (response as any).message || "Failed to save job");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#FFF2E6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF7F50" />
        <Text className="text-textmuted mt-4">Loading job data...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#FFF2E6",
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 32,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-textmain mb-8">
        {isEdit ? "Edit Job" : "Add New Job"}
      </Text>

      {/* Job title */}
      <Text className="text-textmuted font-medium mb-1">Job Title</Text>
      <TextInput
        className="bg-card p-3 rounded-2xl mb-4"
        placeholder="Enter job title"
        value={form.title}
        onChangeText={(t) => updateField("title", t)}
      />

      {/* Description */}
      <Text className="text-textmuted font-medium mb-1">Description</Text>
      <TextInput
        className="bg-card p-3 rounded-2xl mb-4 min-h-[96px]"
        placeholder="Describe the job"
        value={form.description}
        onChangeText={(t) => updateField("description", t)}
        multiline
      />

      {/* Starting time */}
      <Text className="text-textmuted font-medium mb-1">Starting time</Text>
      <TextInput
        className="bg-card p-3 rounded-2xl mb-4"
        placeholder="e.g. Today 5:00 PM"
        value={form.startTime}
        onChangeText={(t) => updateField("startTime", t)}
      />

      {/* Payment */}
      <Text className="text-textmuted font-medium mb-1">payment</Text>
      <TextInput
        className="bg-card p-3 rounded-2xl mb-4"
        placeholder="e.g. ₹200"
        keyboardType="numeric"
        value={form.payment}
        onChangeText={(t) => updateField("payment", t)}
      />

      {/* Location (free text for now) */}
      <Text className="text-textmuted font-medium mb-1">Location</Text>
      <TextInput
        className="bg-card p-3 rounded-2xl mb-1"
        placeholder="Where will this job happen?"
        value={form.locationText}
        onChangeText={(t) => updateField("locationText", t)}
      />
      <Text className="text-xs text-textmuted mb-4">
        Example: &quot;Near T Nagar bus stand, Chennai&quot;
      </Text>

      {/* Total time */}
      <Text className="text-textmuted font-medium mb-1">Total time</Text>
      <TextInput
        className="bg-card p-3 rounded-2xl mb-6"
        placeholder="e.g. 30 minutes"
        value={form.totalTime}
        onChangeText={(t) => updateField("totalTime", t)}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-accent p-4 rounded-2xl mt-2"
      >
        <Text className="text-white text-center text-lg font-bold">
          {isEdit ? "Save Changes" : "Create Job"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
