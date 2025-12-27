import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-[#F0FDF4] px-6 pt-14">
      
      {/* PROFILE HEADER */}
      <View className="items-center mb-6">
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=12",
          }}
          className="w-28 h-28 rounded-full mb-3"
        />
        <Text className="text-2xl font-bold text-[#14532D]">
          Saran
        </Text>
        <Text className="text-sm text-gray-600">
          Part-time Job Seeker
        </Text>
      </View>

      {/* PROFILE DETAILS */}
      <View className="bg-[#cff5de] rounded-3xl p-6 mb-4">
        <ProfileItem
          icon="phone"
          label="Phone"
          value="+91 98765 43210"
        />
        <ProfileItem
          icon="map-marker"
          label="Location"
          value="Chennai, Tamil Nadu"
        />
        <ProfileItem
          icon="clock-o"
          label="Availability"
          value="Evenings & Weekends"
        />
      </View>

      {/* SKILLS */}
      <View className="bg-[#cff5de] rounded-3xl p-6 mb-4">
        <Text className="text-lg font-semibold text-[#14532D] mb-3">
          Skills
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {[
            "Cleaning",
            "Delivery",
            "Pet Care",
            "Elder Care",
            "Errand Running",
          ].map((skill) => (
            <View
              key={skill}
              className="bg-[#DCFCE7] px-4 py-2 rounded-full"
            >
              <Text className="text-xs text-[#14532D]">
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* EXPERIENCE */}
      <View className="bg-[#cff5de] rounded-3xl p-6 mb-10">
        <Text className="text-lg font-semibold text-[#14532D] mb-2">
          Experience
        </Text>
        <Text className="text-sm text-[#14532D]">
          Fresher / Beginner
        </Text>
      </View>
    </ScrollView>
  );
}

/* REUSABLE COMPONENT */
function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center mb-4">
      <FontAwesome
        name={icon}
        size={18}
        color="#166534"
        style={{ width: 26 }}
      />
      <View>
        <Text className="text-xs text-gray-500">
          {label}
        </Text>
        <Text className="text-sm font-medium text-[#14532D]">
          {value}
        </Text>
      </View>
    </View>
  );
}
