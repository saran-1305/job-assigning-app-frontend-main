import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      if (user.isProfileComplete) {
        // Go to main app
        router.replace("/jobs" as any);
      } else {
        // Complete profile first
        router.replace("/auth/user-details" as any);
      }
    } else {
      // Not authenticated, go to signup
      router.replace("/auth/SignUp" as any);
    }
  }, [isLoading, isAuthenticated, user]);

  // Show loading while checking auth
  return (
    <View className="flex-1 bg-bgmain items-center justify-center">
      <ActivityIndicator size="large" color="#FF7F50" />
    </View>
  );
}
