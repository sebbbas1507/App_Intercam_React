import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import io from "socket.io-client";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { AuthContext } from "@/context/AuthContext";

const socket = io("http://192.168.0.9:4001");
const url = "http://192.168.0.9:4001/api/";

const Chat = () => {
  const user = useContext(AuthContext);
  const userEmail = user ? user.email : "Anónimo";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Mensajes actuales
  const [storedMessages, setStoredMessages] = useState([]); // Mensajes almacenados anteriores

  const scrollViewRef = useRef(null); // 📜 Referencia para hacer scroll automático

  useEffect(() => {
    // Cargar los mensajes anteriores
    axios.get(url + "messages").then((res) => {
      setStoredMessages(res.data.messages.reverse()); // Invertir el orden para que los más antiguos estén arriba
    });

    const receivedMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Agregar al final
    };

    socket.on("message", receivedMessage);
    return () => {
      socket.off("message", receivedMessage);
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true }); // Auto-scroll al final
  }, [messages]);

  const handleMessageSubmit = () => {
    if (!message.trim()) return;

    socket.emit("message", message, userEmail);
    setMessages((prevMessages) => [...prevMessages, { body: message, from: userEmail }]); // Agregar al final
    setMessage("");

    axios.post(url + "save", {
      message: message,
      from: userEmail,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatHeader}>Chat Intercam</Text>

      {/* 📜 Contenedor con estilo Glass UI */}
      <View style={styles.glassContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageContainer}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }} // Cambiar para que los mensajes se alineen desde arriba
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })} // 📜 Auto-scroll al final
        >
          {storedMessages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                {
                  alignSelf: msg.from === userEmail ? "flex-end" : "flex-start",
                  backgroundColor: msg.from === userEmail ? "#c471ed" : "#E6E6E6",
                },
              ]}
            >
              <Text>{msg.from === userEmail ? msg.message : `${msg.from}: ${msg.message}`}</Text>
            </View>
          ))}
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                {
                  alignSelf: msg.from === userEmail ? "flex-end" : "flex-start",
                  backgroundColor: msg.from === userEmail ? "#c471ed" : "#E6E6E6",
                },
              ]}
            >
              <Text>{msg.from === userEmail ? msg.body : `${msg.from}: ${msg.body}`}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 📝 Input y botón para enviar mensajes */}
      <View style={styles.messageForm}>
        <TextInput
          style={styles.messageInput}
          placeholder="Escribe un mensaje..."
          onChangeText={setMessage}
          value={message}
        />
        <Button
          icon={<Ionicons name="send" size={24} color="#fff" />}
          onPress={handleMessageSubmit}
          buttonStyle={styles.sendButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12c2e9",
  },
  chatHeader: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    color: "#fff",
  },
  glassContainer: {
    flex: 1, // Ocupar el espacio disponible
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Negro translúcido (Glass UI)
    borderRadius: 15, // Bordes redondeados
    padding: 10, // Espaciado interno
    marginHorizontal: 10, // Margen lateral
    marginBottom: 10, // Espaciado inferior
  },
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  messageForm: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Fondo semi-transparente
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  messageInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007BFF",
    borderRadius: 50,
    padding: 10,
  },
});

export default Chat;
