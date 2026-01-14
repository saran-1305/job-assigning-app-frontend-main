// app/auth/SignUp.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { sendOTP } from "../../services/auth.service";

export default function SignUp() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      Alert.alert("Invalid number", "Please enter a 10 digit phone number.");
      return;
    }

    setLoading(true);
    try {
      // Format phone with country code
      const fullPhone = `+91${digits}`;

      // Send OTP via Firebase
      const result = await sendOTP(fullPhone);

      if (result.success) {
        // Navigate to OTP screen
        router.push({
          pathname: "/auth/otp",
          params: {
            phone: fullPhone,
            mode: "signup",
            mockMode: result.mockMode ? "true" : "false",
          },
        } as any);

        // Store confirmation result globally for OTP verification
        if (result.confirmationResult) {
          (global as any).confirmationResult = result.confirmationResult;
        }
      } else {
        Alert.alert("Error", result.error || "Failed to send OTP");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-bgmain">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 15,
        }}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardOpeningTime={0}
      >
        <View>
          {/* Icon + title */}
          <View className="items-center mb-6">
            <FontAwesome name="paper-plane" size={48} color="#111827" />
            <Text className="text-3xl mt-8 font-bold text-textmain">
              Create Account
            </Text>
          </View>

          {/* Label */}
          <Text className="text-textmuted font-medium">Phone Number</Text>

          {/* Input */}
          <View className="flex-row items-center bg-card rounded-xl mt-1 mb-3">
            <Text className="px-3 text-gray-600">+91</Text>
            <TextInput
              className="flex-1 p-3 text-textmain"
              placeholder="Enter phone number"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
              editable={!loading}
            />
          </View>

          {/* Primary CTA button */}
          <TouchableOpacity
            className={`p-4 rounded-xl mt-4 ${loading ? "bg-gray-400" : "bg-accent"}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-center text-white font-bold text-lg">
                Continue
              </Text>
            )}
          </TouchableOpacity>

          {/* Link to login */}
          <TouchableOpacity
            onPress={() => router.push("/auth/Login" as any)}
            className="mt-4"
            disabled={loading}
          >
            <Text className="text-center text-textmuted text-sm underline">
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
