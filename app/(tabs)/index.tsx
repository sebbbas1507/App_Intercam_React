import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card } from "react-native-elements";
import io from "socket.io-client";
import axios from "axios";
import { logout } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

const socket = io("http://192.168.0.9:4003");
const url = "http://192.168.0.9:4003/api/";

const Posts = () => {
  const router = useRouter();
  const user = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  useEffect(() => {
    axios
      .get(url + "publicaciones")
      .then((res) => setPublicaciones(res.data.publicaciones))
      .catch((error) => console.error("Error al obtener publicaciones:", error.message));

    const receivedPublicacion = (publicacion) => {
      setPublicaciones((prev) => [publicacion, ...prev]);
    };

    const updateLikeListener = (data) => {
      setPublicaciones((prev) =>
        prev.map((post) =>
          post._id === data.id ? { ...post, like: data.like } : post
        )
      );
    };

    socket.on("publicacion", receivedPublicacion);
    socket.on("updateLike", updateLikeListener);

    return () => {
      socket.off("publicacion", receivedPublicacion);
      socket.off("updateLike", updateLikeListener);
    };
  }, []);

  const handleLikeSubmit = async (id) => {
    if (!id) {
      console.error("❌ Error: ID de la publicación es undefined");
      alert("Error al dar like. Intenta de nuevo.");
      return;
    }

    try {
      console.log(`🔄 Enviando like a la publicación con ID: ${id}`);

      const response = await axios.put(`${url}publicaciones/${id}`);

      console.log("📩 Respuesta del servidor:", response.status, response.data);

      if (response.data.status === "success") {
        setPublicaciones((prev) =>
          prev.map((post) =>
            post._id === id ? { ...post, like: response.data.publicacion.like } : post
          )
        );
        socket.emit("likeUpdated", { id, like: response.data.publicacion.like });
      }
    } catch (error) {
      console.error("🚨 Error al dar like:", error.response?.data || error.message);
    }
  };

  const goToChat = (fromUser) => {
    router.push(`/chat?user=${fromUser}`);
  };

  const onAddPublicacion = () => {
    router.push("/add-post");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const filteredPublicaciones = publicaciones.filter(
    (publicacion) => (publicacion.texto ?? "").toLowerCase().includes(searchText.toLowerCase())
  );
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      {/* 📌 Contenedor para la imagen y el título */}
      <View style={styles.leftContainer}>
        <Image source={require("../../assets/images/intercam.png")} style={styles.profilePicture} />
        <Text style={styles.chatHeader}>Intercam</Text>
      </View>

      {/* 📌 Botón alineado a la derecha */}
      <Button title="Cerrar Sesión" onPress={handleLogout} buttonStyle={{ backgroundColor: "#bb45e6" }} />
    </View>
      
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar publicaciones..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Contenedor de publicaciones */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {filteredPublicaciones.map((publicacion, index) => (
           <Card key={index} containerStyle={styles.card}>
            <Card.Title style={styles.title}>{publicacion.from}</Card.Title>
            <Card.Divider />
            <Text style={styles.text}>Artículo: {publicacion.texto}</Text>
            <Text style={styles.subText}>Descripción: {publicacion.barrio}</Text>

            <Text style={styles.subText}>nombre: {publicacion.nombre}</Text>
            <Text style={styles.subText}>valorcomercial: {publicacion.valorcomercial}</Text>
            <Text style={styles.subText}>factura: {publicacion.factura}</Text>
            <Text style={styles.subText}>caja: {publicacion.caja}</Text>
            <Text style={styles.subText}>manuales: {publicacion.manuales}</Text>

            <Text style={styles.subText}>{publicacion.fecha}</Text>
            {publicacion.imagen && (
              <Image source={{ uri: publicacion.imagen }} style={styles.image} />
            )}
            
            <View style={styles.likeContainer}>
              <Button
                icon={<Ionicons name="heart" size={24} color={"#b92b27"} />}
                onPress={() => handleLikeSubmit(publicacion._id)}
                buttonStyle={styles.likeButton}
              />
              <Text style={styles.likeText}>{publicacion.like}</Text>
            </View>
            {/* Botón para ir al chat */}
            <Button
              title="Ir al Chat"
              onPress={() => goToChat(publicacion.from)}
              buttonStyle={styles.chatButton}
            />
          </Card>
        ))}
      </ScrollView>

      {/* Botón flotante para agregar publicación */}
      <View style={styles.optionsBoton}>
        <Button
          icon={<Ionicons name="add-circle" size={40} color="white" />}
          buttonStyle={styles.addButton}
          onPress={onAddPublicacion}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12c2e9" },
  header: {
    flexDirection: "row", // 📌 Elementos en fila (horizontal)
    alignItems: "center", // 📌 Alinear verticalmente
    justifyContent: "space-between", // 📌 Mantiene el botón a la derecha
    paddingHorizontal: 10, // 📌 Espaciado lateral
    backgroundColor: "#007BFF",
  },
  leftContainer: {
    flexDirection: "row", // 📌 Imagen y título en fila
    alignItems: "center", // 📌 Alinear verticalmente
    flex: 1, // 📌 Ocupa todo el espacio disponible, empujando el botón a la derecha
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 1,
    marginVertical: 10,
  },
  chatHeader: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 3, // 📌 Separación exacta entre imagen y texto
  },

  searchBar: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  card: {
    width: "30%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    boxShadow: "5px 12px 15px rgba(224, 10, 243, 0.5)", // Reemplazo de sombra
    elevation: 3, // Mantiene la sombra en Android
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  text: { fontSize: 16, color: "#333", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666", marginBottom: 5, textAlign: "center" },
  image: { width: "100%", height: 200, borderRadius: 10, marginTop: 10 },
  likeContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
  likeButton: { borderRadius: 20, backgroundColor: "#FFF5C3" },
  likeText: { fontSize: 16, marginLeft: 10 },
  chatButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 8,
  },
  optionsBoton: { position: "absolute", bottom: 20, right: 20 },
  addButton: { backgroundColor: "#007BFF", borderRadius: 50, padding: 10 },
});

export default Posts;
