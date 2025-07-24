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

export default function PaymentsScreen() {
  const [customerId, setCustomerId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    const q = query(collection(db, "payments"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleAdd = async () => {
    if (!customerId || !amountPaid) {
      return Alert.alert("Error", "Please fill customer ID and amount");
    }
    try {
      await addDoc(collection(db, "payments"), {
        customerId,
        amountPaid: Number(amountPaid),
        notes,
        date: serverTimestamp(),
      });
      setCustomerId("");
      setAmountPaid("");
      setNotes("");
      loadPayments();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Receive Payments</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Customer ID"
          value={customerId}
          onChangeText={setCustomerId}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount Paid"
          value={amountPaid}
          onChangeText={setAmountPaid}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
        />
        <Button title="Add Payment" onPress={handleAdd} />
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.customerId}</Text>
            <Text>Paid: {item.amountPaid}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No payments yet.</Text>}
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
