import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import Boton from '@/components/Boton'; // Ruta corregida
import { AuthContext } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';


const socket = io('http://192.168.0.9:4003');
const url = "http://192.168.0.9:4003/api/";

function AddPost() {
  const user = useContext(AuthContext);
  const userEmail = user ? user.email : null;
  const router = useRouter();
  const [nickname, setNickname] = useState(userEmail);
  const [fecha, setFecha] = useState(new Date().toISOString());
  const [texto, setTexto] = useState('');
  const [nombre, setNombre] = useState('');
  const [valorcomercial, setValorcomercial] = useState('');
  const [factura, setFactura] = useState('');
  const [caja, setCaja] = useState('');
  const [manuales, setManuales] = useState('');
  const [imagen, setSelectedImage] = useState(null);
  const [barrio, setBarrio] = useState('');
  const [like, setLike] = useState(1);

  const [disabled, setDisabled] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [storedPublicaciones, setStoredPublicaciones] = useState([]);
  const [firstTime, setFirstTime] = useState(false);


  useEffect(() => {
    const receivedPublicacion = (publicacion) => {
      setPublicaciones([publicacion, ...publicaciones]);
    };

    socket.on('publicacion', receivedPublicacion);

    return () => {
      socket.off('publicacion', receivedPublicacion);
    };
  }, [publicaciones]);

  if (!firstTime) {
    axios.get(url + "publicaciones").then((res) => {
      setStoredPublicaciones(res.data.publicaciones);
    });
    setFirstTime(true);
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      alert('Imagen seleccionada');
    } else {
      alert('No has seleccionado ninguna imagen.');
    }
  };




  const handleMessageSubmit = () => {
    if (nickname !== '') {
      socket.emit('publicacion', nickname, fecha, texto, nombre, valorcomercial, factura, caja, manuales, imagen, barrio, like);

      const newPublicacion = {
        from: "",
        fecha: fecha,
        body: texto,
        nombre: nombre,
        valorcomercial: valorcomercial,
        factura: factura,
        caja: caja,
        manuales: manuales,
        imagen: imagen,
        barrio: barrio,
        like: like
      };

      setPublicaciones([newPublicacion, ...publicaciones]);
      setTexto('');

      axios.post(url + 'save', {
        from: nickname,
        fecha: fecha,
        texto: texto,
        nombre: nombre,
        valorcomercial: valorcomercial,
        factura: factura,
        caja: caja,
        manuales: manuales,
        imagen: imagen,
        barrio: barrio,
        like: like

      });
    } else {
      alert('Para enviar mensajes debes establecer un nickname!!!');
    }
    console.log("Publicacion Creada!")
    alert('Publicacion exitosa');
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
       <Text style={styles.chatHeader}>Crear Publicación</Text>
      <TextInput
        style={styles.input}
        placeholder="En que clasifica el articulo"
        onChangeText={setTexto}
        value={texto}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Donde esta ubicado el producto?"
        onChangeText={setBarrio}
        value={barrio}
      />
      <TextInput
        style={styles.input}
        placeholder="Titulo del producto"
        onChangeText={setNombre}
        value={nombre}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Que valor comercial tiene?"
        onChangeText={setValorcomercial}
        value={valorcomercial}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Cuenta con factura?"
        onChangeText={setFactura}
        value={factura}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Cuenta con caja?"
        onChangeText={setCaja}
        value={caja}
      />
      <TextInput
        style={styles.input}
        placeholder="¿Cuenta con manuales?"
        onChangeText={setManuales}
        value={manuales}
      />
      <Boton theme="primary" label="Subir Imagen" onPress={pickImageAsync} />
      <Button title="Publicar" onPress={handleMessageSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#12c2e9",
    padding: 20,
  },
  chatHeader: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: "#fff",
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AddPost;
