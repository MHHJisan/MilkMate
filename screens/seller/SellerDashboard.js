// screens/SellerDashboard.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default function SellerDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch customers
        const custSnap = await getDocs(
          query(
            collection(db, "customers"),
            orderBy("createdAt", "desc"),
            limit(5)
          )
        );
        setCustomers(custSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Fetch deliveries
        const delSnap = await getDocs(
          query(collection(db, "deliveries"), orderBy("date", "desc"), limit(5))
        );
        setDeliveries(delSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Fetch payments
        const paySnap = await getDocs(
          query(collection(db, "payments"), orderBy("date", "desc"), limit(5))
        );
        setPayments(paySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderCard = (title, data, onPress) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCount}>{data.length}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }, fields) => (
    <View style={styles.listItem}>
      {fields.map((f) => (
        <Text key={f} style={styles.itemText}>
          {`${f}: ${item[f]}`}
        </Text>
      ))}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Welcome, Seller!</Text>
          <View style={styles.cardRow}>
            {renderCard("Customers", customers, () =>
              navigation.navigate("CustomersList")
            )}
            {renderCard("Deliveries", deliveries, () =>
              navigation.navigate("DeliveryHistory")
            )}
            {renderCard("Payments", payments, () =>
              navigation.navigate("PaymentHistory")
            )}
          </View>

          <Text style={styles.sectionHeader}>Recent Customers</Text>
          <FlatList
            data={customers}
            keyExtractor={(i) => i.id}
            renderItem={(item) => renderItem(item, ["name", "dailyQty"])}
          />

          <Text style={styles.sectionHeader}>Recent Deliveries</Text>
          <FlatList
            data={deliveries}
            keyExtractor={(i) => i.id}
            renderItem={(item) => renderItem(item, ["customerId", "quantity"])}
          />

          <Text style={styles.sectionHeader}>Recent Payments</Text>
          <FlatList
            data={payments}
            keyExtractor={(i) => i.id}
            renderItem={(item) =>
              renderItem(item, ["customerId", "amountPaid"])
            }
          />
        </>
      }
      data={[]}
      renderItem={null}
      ListEmptyComponent={null}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", margin: 16, textAlign: "center" },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "30%",
  },
  cardTitle: { color: "#fff", fontSize: 16 },
  cardCount: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 8 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 24,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginHorizontal: 16,
  },
  itemText: { fontSize: 14 },
});
