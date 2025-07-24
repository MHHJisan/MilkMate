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
import { Picker } from "@react-native-picker/picker";
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
  const [dailyQty, setDailyQty] = useState("1"); // default 1 L
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
        // parseFloat handles "0.5" correctly
        dailyQty: parseFloat(dailyQty),
        ratePerLtr: parseFloat(rate),
        paymentCycle: "WEEKLY",
        createdAt: serverTimestamp(),
      });
      // reset fields
      setName("");
      setPhone("");
      setDailyQty("1");
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

        <Text style={styles.label}>Daily Quantity (L):</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dailyQty}
            onValueChange={setDailyQty}
            style={styles.picker}
          >
            <Picker.Item label="0.5 L" value="0.5" />
            <Picker.Item label="1 L" value="1" />
            <Picker.Item label="2 L" value="2" />
          </Picker>
        </View>

        <TextInput
          placeholder="Rate per Litre"
          value={rate}
          onChangeText={setRate}
          style={styles.input}
          keyboardType="decimal-pad"
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
              {item.phone} • {item.dailyQty} L @ {item.ratePerLtr}/L
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
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
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
