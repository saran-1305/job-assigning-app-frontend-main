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
    // keep only digits
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      Alert.alert("Invalid number", "Please enter a 10 digit phone number.");
      return;
    }

    // 👉 Generate a 6-digit OTP (demo only)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Show OTP so user can type it on next screen (fake SMS)
    Alert.alert("OTP sent", `Demo OTP: ${otp}`);

    // ✅ Safer navigation: object style with params
    router.push({
      pathname: "/auth/otp",
      params: {
        phone: digits,
        otp,
        mode: "signup",
      },
    } as any);
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
        <Text className="text-3xl mt-8 font-bold text-textmain">
          Login
        </Text>
      </View>

      <Text className="text-textmuted font-medium">Phone Number</Text>
      <TextInput
        className="bg-card p-3 rounded-xl mt-1 mb-3"
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        className="bg-accent p-4 rounded-xl mt-4"
        onPress={handleSubmit}
      >
        <Text className="text-center text-white font-bold text-lg">
          Continue
        </Text>
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
