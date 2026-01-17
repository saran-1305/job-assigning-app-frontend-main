// app/auth/otp.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { verifyOTP, verifyOTPWithId, sendOTP } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function Otp() {
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams();

  // Clean params from string | string[] -> string
  const phone =
    Array.isArray(params.phone)
      ? params.phone[0]
      : (params.phone as string | undefined) ?? "";

  const verificationId =
    Array.isArray(params.verificationId)
      ? params.verificationId[0]
      : (params.verificationId as string | undefined) ?? "";

  const mode =
    Array.isArray(params.mode)
      ? params.mode[0]
      : (params.mode as string | undefined) ?? "login";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Alert.alert("Enter OTP", "Please enter the 6-digit OTP sent to your phone.");
      return;
    }

    setLoading(true);
    try {
      // Verify OTP - the auth service stores confirmationResult internally
      const result = await verifyOTP(code);

      if (result.success && result.user) {
        // Login with the user data
        await login(result.user);

        // Navigate based on profile completion
        if (result.user.isProfileComplete) {
          router.replace("/jobs" as never);
        } else {
          router.replace("/auth/user-details" as never);
        }
      } else {
        Alert.alert("Error", result.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phone) {
      Alert.alert("Error", "Phone number not found. Please go back and try again.");
      return;
    }

    setResending(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        Alert.alert("OTP Sent", "A new OTP has been sent to your phone.");
      } else {
        Alert.alert("Error", result.error || "Failed to resend OTP");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        backgroundColor: "#FFF2E6",
        paddingHorizontal: 24,
        paddingVertical: 15,
      }}
      enableOnAndroid={true}
      extraScrollHeight={30}
      keyboardOpeningTime={0}
    >
      <View>
        <View className="items-center mb-6">
          <FontAwesome name="paper-plane" size={48} color="textmain" />
          <Text className="text-3xl mt-8 font-bold text-textmain">
            Enter OTP
          </Text>
        </View>

        {phone !== "" && (
          <Text className="text-center text-textmuted mb-4">
            We sent a code to {phone}
          </Text>
        )}

        <Text className="text-textmuted font-medium">OTP</Text>
        <TextInput
          className="bg-card p-3 rounded-xl mt-1 mb-3 text-center tracking-[8px]"
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          editable={!loading}
        />

        <TouchableOpacity
          className={`p-4 rounded-xl mt-4 ${loading ? "bg-gray-400" : "bg-accent"}`}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-center text-white font-bold text-lg">
              Verify
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendOTP}
          className="mt-6"
          disabled={loading || resending}
        >
          {resending ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text className="text-center text-textmuted">
              Didn't receive code? <Text className="font-bold">Resend</Text>
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4"
          disabled={loading}
        >
          <Text className="text-center text-textmuted underline">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
