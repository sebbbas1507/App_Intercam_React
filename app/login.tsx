import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Iniciar sesión con email y contraseña
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/index");
    } catch (error) {
      Alert.alert("Error", "Usuario o Contraseña Incorrectos.");
    }
  };

  // 🔹 Iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/(tabs)/index");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground source={require("../assets/images/casas.jpg")} style={styles.background}>
      <View style={styles.glassContainer}>
      <Image source={require("../assets/images/intercam.png")} style={styles.profilePicture} />
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButton}>
          <Text style={styles.buttonText}>Ingresar con Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")} style={styles.registerText}>
          <Text>¿No tienes cuenta? <Text style={{ fontWeight: 'bold' }}>Regístrate</Text></Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%", // Ocupar todo el ancho de la pantalla
    height: "100%", // Ocupar todo el alto de la pantalla
    resizeMode: "cover", // Ajuste para cubrir toda la pantalla
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    backgroundColor: "rgba(24, 146, 165, 0.55)",
    padding: 20,
    borderRadius: 15,
    width: 300,
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 1,
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  googleButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 15,
  },
});
