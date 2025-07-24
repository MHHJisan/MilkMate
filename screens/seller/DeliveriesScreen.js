import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
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

export default function DeliveriesScreen({ navigation }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  // Load customers
  const loadCustomers = async () => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const customerList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCustomers(customerList);
  };

  // Load deliveries
  const loadDeliveries = async () => {
    const q = query(collection(db, "deliveries"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    setDeliveries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // When customer is selected, update quantity and rate
  useEffect(() => {
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (customer) {
      setQuantity(customer.dailyQty.toString());
      setRate(customer.ratePerLtr.toString());
    } else {
      setQuantity("");
      setRate("");
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    loadCustomers();
    loadDeliveries();
  }, []);

  const handleAdd = async () => {
    if (!selectedCustomerId || !quantity || !rate) {
      return Alert.alert(
        "Error",
        "Please select a customer and ensure values are filled."
      );
    }
    try {
      await addDoc(collection(db, "deliveries"), {
        customerId: selectedCustomerId,
        quantity: parseFloat(quantity),
        rate: parseFloat(rate),
        amount: parseFloat(quantity) * parseFloat(rate),
        date: serverTimestamp(),
      });
      setSelectedCustomerId("");
      setQuantity("");
      setRate("");
      loadDeliveries();
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

      <Text style={styles.heading}>Record Deliveries</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Select Customer</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCustomerId}
            onValueChange={setSelectedCustomerId}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Customer --" value="" />
            {customers.map((customer) => (
              <Picker.Item
                key={customer.id}
                label={`${customer.name} (${customer.phone})`}
                value={customer.id}
              />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Quantity (L)"
          value={quantity}
          editable={false}
          style={styles.input}
        />
        <TextInput
          placeholder="Rate/Ltr"
          value={rate}
          editable={false}
          style={styles.input}
        />
        <Button title="Add Delivery" onPress={handleAdd} />
      </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Customer ID: {item.customerId}</Text>
            <Text>
              {item.quantity}L × {item.rate}/L = {item.amount.toFixed(2)}
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
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  backText: {
    color: "#007bff",
    fontSize: 16,
  },
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  form: { marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
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
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
