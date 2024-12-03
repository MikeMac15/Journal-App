import { UserProvider } from "@/components/Context/UserContext";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  return (
  <UserProvider>
    <Slot />
  </UserProvider>
  );
}
