import { useEffect, useState } from "react";
import { useRouter, Slot } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "../context/AuthContext"; // Asegúrate de la ruta correcta
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthChecked) {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthChecked, user]);

  // Muestra un spinner de carga mientras se verifica la autenticación
  if (!isAuthChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
