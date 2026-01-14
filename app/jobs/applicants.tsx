// app/jobs/applicants.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { 
  getJobApplicants, 
  handleApplication, 
  JobApplication 
} from "../../services/job.service";

export default function ApplicantsScreen() {
  const router = useRouter();
  const { jobId, jobTitle } = useLocalSearchParams<{ 
    jobId: string; 
    jobTitle: string; 
  }>();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    if (!jobId) return;
    
    try {
      const response = await getJobApplicants(jobId);
      if (response.success && response.data?.applications) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplicants();
  };

  const handleAccept = async (applicationId: string) => {
    Alert.alert(
      "Accept Application",
      "Accept this worker for the job? This will reject all other applicants.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            setProcessingId(applicationId);
            try {
              const response = await handleApplication(applicationId, "accept");
              if (response.success) {
                Alert.alert(
                  "Success",
                  "Application accepted! You can now chat with the worker.",
                  [
                    {
                      text: "Go to Chat",
                      onPress: () => {
                        if (response.data?.chatRoomId) {
                          router.push({
                            pathname: "/jobs/chat",
                            params: { chatRoomId: response.data.chatRoomId },
                          } as any);
                        } else {
                          router.back();
                        }
                      },
                    },
                  ]
                );
              } else {
                Alert.alert("Error", (response as any).message || "Failed to accept application");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            } finally {
              setProcessingId(null);
              fetchApplicants();
            }
          },
        },
      ]
    );
  };

  const handleReject = async (applicationId: string) => {
    Alert.alert(
      "Reject Application",
      "Are you sure you want to reject this application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setProcessingId(applicationId);
            try {
              const response = await handleApplication(applicationId, "reject");
              if (response.success) {
                setApplications((prev) =>
                  prev.map((app) =>
                    app.id === applicationId
                      ? { ...app, status: "Rejected" as const }
                      : app
                  )
                );
              } else {
                Alert.alert("Error", "Failed to reject application");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-bgmain items-center justify-center">
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  const pendingApps = applications.filter((a) => a.status === "Applied");
  const processedApps = applications.filter((a) => a.status !== "Applied");

  return (
    <View className="flex-1 bg-bgmain">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4"
          >
            <FontAwesome name="arrow-left" size={18} color="#111827" />
            <Text className="ml-2 text-textmain">Back</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-textmain">Applicants</Text>
          <Text className="text-textmuted mt-1">
            {jobTitle || "Job Applications"}
          </Text>
        </View>

        {/* EMPTY STATE */}
        {applications.length === 0 && (
          <View className="items-center py-10">
            <FontAwesome name="users" size={48} color="#ccc" />
            <Text className="text-textmuted mt-4 text-center">
              No applications yet.{"\n"}Share your job to get applicants!
            </Text>
          </View>
        )}

        {/* PENDING APPLICATIONS */}
        {pendingApps.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-textmain mb-3">
              Pending ({pendingApps.length})
            </Text>

            {pendingApps.map((app) => (
              <ApplicantCard
                key={app.id}
                application={app}
                onAccept={() => handleAccept(app.id)}
                onReject={() => handleReject(app.id)}
                isProcessing={processingId === app.id}
              />
            ))}
          </View>
        )}

        {/* PROCESSED APPLICATIONS */}
        {processedApps.length > 0 && (
          <View>
            <Text className="text-lg font-semibold text-textmain mb-3">
              Processed ({processedApps.length})
            </Text>

            {processedApps.map((app) => (
              <ApplicantCard
                key={app.id}
                application={app}
                showStatus
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Applicant Card Component
function ApplicantCard({
  application,
  onAccept,
  onReject,
  isProcessing,
  showStatus,
}: {
  application: JobApplication;
  onAccept?: () => void;
  onReject?: () => void;
  isProcessing?: boolean;
  showStatus?: boolean;
}) {
  const applicant = application.applicantId;
  const isPending = application.status === "Applied";

  return (
    <View className="bg-card rounded-3xl p-4 mb-3">
      <View className="flex-row items-center">
        {/* Profile Image */}
        <Image
          source={{
            uri: applicant.profileImage || "https://i.pravatar.cc/150?img=1",
          }}
          className="w-14 h-14 rounded-full"
        />

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-textmain font-semibold text-base">
            {applicant.name || "User"}
          </Text>
          <Text className="text-textmuted text-xs">
            {applicant.phone}
          </Text>
          {applicant.rating && applicant.rating.average > 0 && (
            <View className="flex-row items-center mt-1">
              <FontAwesome name="star" size={12} color="#F59E0B" />
              <Text className="text-xs text-textmuted ml-1">
                {applicant.rating.average.toFixed(1)} ({applicant.rating.count} reviews)
              </Text>
            </View>
          )}
        </View>

        {/* Status Badge */}
        {showStatus && (
          <View
            className={`px-3 py-1 rounded-full ${
              application.status === "Accepted"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <Text
              className={`text-xs ${
                application.status === "Accepted"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {application.status}
            </Text>
          </View>
        )}
      </View>

      {/* Skills */}
      {applicant.skills && applicant.skills.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mt-3">
          {applicant.skills.slice(0, 3).map((skill: string) => (
            <View key={skill} className="bg-bgmain px-2 py-1 rounded-full">
              <Text className="text-xs text-textmuted">{skill}</Text>
            </View>
          ))}
          {applicant.skills.length > 3 && (
            <Text className="text-xs text-textmuted self-center">
              +{applicant.skills.length - 3} more
            </Text>
          )}
        </View>
      )}

      {/* Message */}
      {application.message && (
        <Text className="text-textmuted text-sm mt-2 italic">
          "{application.message}"
        </Text>
      )}

      {/* Action Buttons */}
      {isPending && onAccept && onReject && (
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            onPress={onAccept}
            disabled={isProcessing}
            className={`flex-1 py-3 rounded-full items-center ${
              isProcessing ? "bg-gray-300" : "bg-green-600"
            }`}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-medium">Accept</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onReject}
            disabled={isProcessing}
            className="flex-1 py-3 rounded-full items-center border border-red-500"
          >
            <Text className="text-red-500 font-medium">Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
