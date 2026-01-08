import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

export default function JobMapScreen() {
  const { lat, lng, title } = useLocalSearchParams<{
    lat: string;
    lng: string;
    title: string;
  }>();

  const [userLoc, setUserLoc] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLoc({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    })();
  }, []);

  if (!userLoc) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
html, body, #map { height: 100%; margin: 0; }
.info {
  position: absolute;
  bottom: 15px;
  left: 10px;
  right: 10px;
  background: white;
  padding: 12px;
  border-radius: 10px;
  font-family: sans-serif;
}
</style>
</head>

<body>
<div id="map"></div>
<div class="info" id="info">Calculating route...</div>

<script>
const user = [${userLoc.lat}, ${userLoc.lng}];
const job = [${lat}, ${lng}];

const map = L.map("map").setView(user, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

L.marker(user).addTo(map).bindPopup("You");
L.marker(job).addTo(map).bindPopup("${title}");

fetch(
  "https://router.project-osrm.org/route/v1/driving/" +
  user[1] + "," + user[0] + ";" +
  job[1] + "," + job[0] +
  "?overview=full&geometries=geojson"
)
.then(res => res.json())
.then(data => {
  const route = data.routes[0];
  const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);

  L.polyline(coords, { color: "green", weight: 5 }).addTo(map);
  map.fitBounds(coords);

  const km = (route.distance / 1000).toFixed(2);
  const min = Math.round(route.duration / 60);

  document.getElementById("info").innerHTML =
    "<b>Distance:</b> " + km + " km<br>" +
    "<b>ETA:</b> " + min + " mins";
});
</script>
</body>
</html>
`;

  return (
    <View style={{ flex: 1 }}>
      <WebView originWhitelist={["*"]} source={{ html }} />
    </View>
  );
}
