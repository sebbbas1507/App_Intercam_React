import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Registrar usuario con email y contraseña
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Usuario registrado con exito');
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Registrarse</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
      />
      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: "green", padding: 10, marginVertical: 10 }}>
        <Text style={{ color: "white" }}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 20 }}>
        <Text>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
