import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card } from "react-native-elements";
import io from "socket.io-client";
import axios from "axios";
import { logout } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

const socket = io("http://192.168.0.7:4003");
const url = "http://192.168.0.7:4003/api/";

const Profile = () => {
  const router = useRouter();
  const user = useContext(AuthContext);
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(url + "publicaciones")
        .then((res) => {
          const userPosts = res.data.publicaciones.filter(
            (post) => post.from === user.email
          );
          setPublicaciones(userPosts);
        })
        .catch((error) => {
          console.error("Error al obtener publicaciones:", error.message);
        });
    }
  }, [user]);

  const handleLikeSubmit = (id) => {
    setPublicaciones((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, like: post.like + 1 } : post
      )
    );
    Alert.alert("¡Te gusta esta publicación! ❤️");
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar Publicación",
      "¿Estás seguro de que quieres eliminar esta publicación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await axios.delete(`${url}publicaciones/${id}`);
              setPublicaciones(publicaciones.filter((post) => post.id !== id));
              Alert.alert("Publicación eliminada correctamente.");
            } catch (error) {
              console.error("Error al eliminar publicación:", error);
              Alert.alert("Error al eliminar la publicación.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.chatHeader}>Mi Perfil</Text>
        <Button title="Cerrar Sesión" onPress={handleLogout} />
      </View>

      {/* Publicaciones del usuario */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {publicaciones.length > 0 ? (
          publicaciones.map((publicacion, index) => (
            <Card key={index} containerStyle={styles.card}>
              <Card.Title style={styles.title}>{publicacion.from}</Card.Title>
              <Card.Divider />
              <Text style={styles.text}>{publicacion.texto}</Text>
              <Text style={styles.subText}>Barrio: {publicacion.barrio}</Text>
              <Text style={styles.subText}>{publicacion.fecha}</Text>
              {publicacion.imagen && (
                <Image
                  source={{ uri: publicacion.imagen }}
                  style={styles.image}
                />
              )}
              <View style={styles.buttonContainer}>
                <Button
                  icon={<Ionicons name="heart" size={24} color={"#b92b27"} />}
                  onPress={() => handleLikeSubmit(publicacion.id)}
                  buttonStyle={styles.likeButton}
                />
                <Text style={styles.likeText}>{publicacion.like}</Text>
                <Button
                  icon={<Ionicons name="trash" size={24} color={"#fff"} />}
                  onPress={() => handleDelete(publicacion.id)}
                  buttonStyle={styles.deleteButton}
                />
              </View>
            </Card>
          ))
        ) : (
          <Text style={styles.noPosts}>No has publicado nada aún.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12c2e9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007BFF",
  },
  chatHeader: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  likeButton: {
    borderRadius: 20,
    backgroundColor: "#FFF5C3",
  },
  deleteButton: {
    borderRadius: 20,
    backgroundColor: "#DC3545",
  },
  likeText: {
    fontSize: 16,
    marginLeft: 10,
  },
  noPosts: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Profile;
