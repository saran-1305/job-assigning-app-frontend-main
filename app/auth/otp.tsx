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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Otp() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Clean params from string | string[] -> string
  const phone =
    Array.isArray(params.phone) ? params.phone[0] : (params.phone as string | undefined) ?? "";

  const otpFromUrl =
    Array.isArray(params.otp) ? params.otp[0] : (params.otp as string | undefined) ?? "";

  const mode =
    Array.isArray(params.mode) ? params.mode[0] : (params.mode as string | undefined) ?? "login";

  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code) {
      Alert.alert("Enter OTP", "Please enter the OTP sent to your phone.");
      return;
    }

    if (!otpFromUrl) {
      Alert.alert(
        "Something went wrong",
        "We did not receive an OTP from the previous screen. Please go back and try again."
      );
      return;
    }

    if (code !== otpFromUrl) {
      Alert.alert("Incorrect OTP", "The code you entered is not correct.");
      return;
    }

    // ✅ OTP correct → go to next page
    if (mode === "signup") {
      router.replace("/auth/user-details" as never);
    } else {
      // later you can change this to /jobs
      router.replace("/auth/user-details" as never);
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
        />

        <TouchableOpacity
          className="bg-accent p-4 rounded-xl mt-4"
          onPress={handleVerify}
        >
          <Text className="text-center text-white font-bold text-lg">
            Verify
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
