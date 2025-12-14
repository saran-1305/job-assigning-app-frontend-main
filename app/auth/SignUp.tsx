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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUp() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      Alert.alert("Invalid number", "Please enter a 10 digit phone number.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    Alert.alert("OTP sent", `Demo OTP: ${otp}`);

    const href = `/auth/otp?phone=${digits}&otp=${otp}&mode=signup`;
    router.push(href as any);
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
          <TextInput
            className="bg-card p-3 rounded-xl mt-1 mb-3 text-textmain"
            placeholder="Enter phone number"
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Primary CTA button */}
          <TouchableOpacity
            className="bg-accent p-4 rounded-xl mt-4"
            onPress={handleSubmit}
          >
            <Text className="text-center text-white font-bold text-lg">
              Continue
            </Text>
          </TouchableOpacity>

          {/* Link to login */}
          <TouchableOpacity
            onPress={() => router.push("/auth/Login" as any)}
            className="mt-4"
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
