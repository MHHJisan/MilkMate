// screens/CustomersScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
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

export default function CustomersScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dailyQty, setDailyQty] = useState("");
  const [rate, setRate] = useState("");
  const [customers, setCustomers] = useState([]);

  const loadCustomers = async () => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAdd = async () => {
    if (!name || !phone || !dailyQty || !rate) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      await addDoc(collection(db, "customers"), {
        name,
        phone,
        dailyQty: Number(dailyQty),
        ratePerLtr: Number(rate),
        paymentCycle: "WEEKLY",
        createdAt: serverTimestamp(),
      });
      setName("");
      setPhone("");
      setDailyQty("");
      setRate("");
      loadCustomers();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back to Dashboard */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SellerDashboard")}
      >
        <Text style={styles.backText}>← Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Manage Customers</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Daily Qty"
          value={dailyQty}
          onChangeText={setDailyQty}
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
        <Button title="Add Customer" onPress={handleAdd} />
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>
              {item.phone} • {item.dailyQty}L @ {item.ratePerLtr}/L
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No customers yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  backText: {
    color: "#007bff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
