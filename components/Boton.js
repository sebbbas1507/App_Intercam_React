import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";


export default function Boton({ label, theme, onPress }) {
  if (theme === "primary") {
    return (
      <View
      style={[styles.buttonContainer, { borderColor: "#ffd33d", borderRadius: 18 }]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={onPress}
        >
          <FontAwesome
            name="picture-o"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
    </View>
    );
  }
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button 2.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 25,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
