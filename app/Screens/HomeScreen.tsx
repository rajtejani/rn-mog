// screens/HomeScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "@/Context/AppContext";
import CompletedList from "@/components/CompletedList";
import WaitingList from "@/components/WaitingList";
import AddGuestModal from "@/components/AddGuestModal";
import Badge from "@/components/Badge";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const { estimatedWaitingTime, waitingGuests, completedGuests } =
    useAppContext();
  const upcomingGuestsCount = waitingGuests.filter(
    (guest) => guest.status
  ).length;
  const completedGuestsCount = completedGuests.filter(
    (guest) => guest.status
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {activeTab === "upcoming" ? "Waiting List" : "Completed List"}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {activeTab === "upcoming" && (
          <View style={styles.waitingTimeContainer}>
            <Text style={styles.waitingTimeLabel}>Waiting Time</Text>
            <Text style={styles.waitingTimeValue}>
              {estimatedWaitingTime} Mins
            </Text>
          </View>
        )}

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "upcoming" && styles.activeTabText,
              ]}
            >
              Upcoming
            </Text>
            <Badge count={upcomingGuestsCount} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "completed" && styles.activeTab]}
            onPress={() => setActiveTab("completed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "completed" && styles.activeTabText,
              ]}
            >
              Completed
            </Text>
            <Badge count={completedGuestsCount} />
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {activeTab === "upcoming" ? <WaitingList /> : <CompletedList />}
        </View>
      </View>

      <AddGuestModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F1E9",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    fontFamily: "Poppins",
  },
  addButton: {
    backgroundColor: "#E73E1F",
    width: 34,
    height: 34,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  waitingTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#F6F1E9",
    padding: 10,
    borderRadius: 8,
  },
  waitingTimeLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins",
  },
  waitingTimeValue: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Poppins",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#F6F1E9",
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#E53935",
  },
  tabText: {
    fontSize: 16,
    color: "#666666",
  },
  activeTabText: {
    fontWeight: "600",
    color: "#000000",
  },
  listContainer: {
    flex: 1,
  },
});

export default HomeScreen;
