// app/auth/Login.tsx
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

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // keep only digits
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      Alert.alert("Invalid number", "Please enter a 10 digit phone number.");
      return;
    }

    setLoading(true);
    try {
      // Format phone with country code
      const fullPhone = `+91${digits}`;
      
      // Send OTP via Firebase (React Native Firebase handles this natively)
      const result = await sendOTP(fullPhone);
      
      if (result.success) {
        // Navigate to OTP screen with verification ID
        router.push({
          pathname: "/auth/otp",
          params: {
            phone: fullPhone,
            verificationId: result.verificationId || "",
            mode: "login",
          },
        } as any);
      } else {
        Alert.alert("Error", result.error || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#FFF2E6",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 15,
      }}
      enableOnAndroid={true}
      extraScrollHeight={30}
      keyboardOpeningTime={0}
    >
      <View className="items-center mb-6">
        <FontAwesome name="paper-plane" size={48} color="textmain" />
        <Text className="text-3xl mt-8 font-bold text-textmain">Login</Text>
      </View>

      <Text className="text-textmuted font-medium">Phone Number</Text>
      <View className="flex-row items-center bg-card rounded-xl mt-1 mb-3">
        <Text className="px-3 text-gray-600">+91</Text>
        <TextInput
          className="flex-1 p-3"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
          editable={!loading}
        />
      </View>

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

      <TouchableOpacity
        onPress={() => router.push("/auth/SignUp" as any)}
        className="mt-4"
      >
        <Text className="text-center text-textmuted text-sm underline">
          Dont Have An Account? Sign up
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
