import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SkillsInput } from "./SkillsInput";

// 🔹 Firestore imports
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function UserDetails() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const Aadhaar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setAadhaarImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !age || skills.length === 0) {
      Alert.alert(
        "Missing info",
        "Please fill all fields and add at least one skill."
      );
      return;
    }

    try {
      setLoading(true);

      // 🔹 Save user to Firestore (no Storage)
      await addDoc(collection(db, "users"), {
        name,
        age: Number(age),
        skills,
        hasAadhaarImage: !!aadhaarImage,
        createdAt: serverTimestamp(),
      });

      // ✅ Show success and then go to Jobs page
      Alert.alert("Saved", "Your details have been saved!", [
        {
          text: "OK",
          onPress: () => {
            // go to Jobs page
            router.replace("/jobs" as never);
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Something went wrong while saving your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-6 justify-center bg-bgmain">
      <View className="items-center mb-6">
        <FontAwesome name="paper-plane" size={48} color="textmain" />
        <Text className="text-3xl mt-8 font-bold text-textmain">
          User Details
        </Text>
      </View>

      <Text className="text-textmuted font-medium">Full Name</Text>
      <TextInput
        className="bg-card p-3 rounded-xl mt-1 mb-3"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-textmuted font-medium">Age</Text>
      <TextInput
        className="bg-card p-3 rounded-xl mt-1 mb-3"
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      {/* Skills selector */}
      <SkillsInput value={skills} onChange={setSkills} />

      <Text className="text-textmuted font-medium mt-2">Aadhaar Card</Text>

      <TouchableOpacity
        onPress={Aadhaar}
        className="bg-card rounded-xl p-4 mt-2 mb-3"
      >
        {aadhaarImage ? (
          <Image
            source={{ uri: aadhaarImage }}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center bg-card justify-center py-8">
            <FontAwesome name="upload" size={28} color="textmain" />
            <Text className="text-textmuted mt-2">Upload Aadhaar</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-accent p-4 rounded-xl mt-4"
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-center text-white font-bold text-lg">
          {loading ? "Saving..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
