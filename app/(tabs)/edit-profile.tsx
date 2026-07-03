import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/config/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const EditProfile = () => {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [alias, setAlias] = useState(user?.alias || "");
  const [descripcion, setDescripcion] = useState(user?.descripcion || "");
  const [image, setImage] = useState(user?.photoURL || "");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSave = async () => {
    try {
      let photoURL = image;
      if (image && image !== user?.photoURL) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "users", user.uid), {
        alias,
        descripcion,
        photoURL,
      });
      Alert.alert("Perfil actualizado correctamente");
      router.back();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error al actualizar el perfil");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Image source={{ uri: image }} style={styles.profileImage} />
      <Button title="Cambiar Foto" onPress={pickImage} />
      <TextInput
        style={styles.input}
        placeholder="Alias"
        value={alias}
        onChangeText={setAlias}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <Button title="Guardar Cambios" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  profileImage: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 15, fontSize: 18, padding: 5 },
});

export default EditProfile;
