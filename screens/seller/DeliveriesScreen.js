import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default function DeliveriesScreen() {
  const [customerId, setCustomerId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  const loadDeliveries = async () => {
    const q = query(collection(db, "deliveries"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    setDeliveries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleAdd = async () => {
    if (!customerId || !quantity || !rate) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      await addDoc(collection(db, "deliveries"), {
        customerId,
        quantity: Number(quantity),
        rate: Number(rate),
        amount: Number(quantity) * Number(rate),
        date: serverTimestamp(),
      });
      setCustomerId("");
      setQuantity("");
      setRate("");
      loadDeliveries();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Record Deliveries</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Customer ID"
          value={customerId}
          onChangeText={setCustomerId}
          style={styles.input}
        />
        <TextInput
          placeholder="Quantity (L)"
          value={quantity}
          onChangeText={setQuantity}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Rate/Ltr"
          value={rate}
          onChangeText={setRate}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button title="Add Delivery" onPress={handleAdd} />
      </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.customerId}</Text>
            <Text>
              {item.quantity}L × {item.rate}/L = {item.amount}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No deliveries yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  empty: { textAlign: "center", marginTop: 20, color: "#666" },
});
