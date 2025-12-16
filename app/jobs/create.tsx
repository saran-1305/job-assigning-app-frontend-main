// app/jobs/create.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

type Params = {
  mode?: string; // "create" | "edit"
  job?: string;  // JSON string when editing
};

type JobFormState = {
  id?: string;
  title: string;
  description: string;
  startTime: string;
  payment: string;
  locationText: string;
  totalTime: string;
};

export default function CreateJob() {
  const router = useRouter();
  const { mode, job } = useLocalSearchParams<Params>();
  const isEdit = mode === "edit";

  const [form, setForm] = useState<JobFormState>({
    id: undefined,
    title: "",
    description: "",
    startTime: "",
    payment: "",
    locationText: "",
    totalTime: "",
  });

  // Prefill when editing
  useEffect(() => {
    if (isEdit && job) {
      try {
        const parsed = JSON.parse(job as string) as any;
        setForm({
          id: parsed.id,
          title: parsed.title ?? "",
          description: parsed.description ?? "",
          startTime: parsed.startTime ?? "",
          payment: parsed.payment ?? "",
          locationText: parsed.locationText ?? "",
          totalTime: parsed.totalTime ?? "",
        });
      } catch (e) {
        console.warn("Invalid job data passed to edit screen", e);
      }
    }
  }, [isEdit, job]);

  const updateField = (key: keyof JobFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      Alert.alert("Missing Fields", "Please fill at least title and description.");
      return;
    }

    const jobToSend = {
      id: form.id ?? Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      status: "Open",
      startTime: form.startTime.trim(),
      payment: form.payment.trim(),
      locationText: form.locationText.trim(),
      totalTime: form.totalTime.trim(),
    };

    if (isEdit) {
      router.push({
        pathname: "/jobs",
        params: { updatedJob: JSON.stringify(jobToSend) },
      });
    } else {
      router.push({
        pathname: "/jobs",
        params: { newJob: JSON.stringify(jobToSend) },
      });
    }
  };

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
