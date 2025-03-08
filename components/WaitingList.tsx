import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { format, parseISO } from "date-fns";
import Zocial from "@expo/vector-icons/Zocial";
import { useAppContext } from "../Context/AppContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Guest } from "../types";

const WaitingList = () => {
  const { waitingGuests, updateGuestStatus, inLineGuests, setInLineGuests } =
    useAppContext();
  // const [inLineGuests, setInLineGuests] = useState<string[]>([]);
  const calculateWaitedTime = (registeredAt: string) => {
    const registeredTime = parseISO(registeredAt);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - registeredTime.getTime()) / 60000
    );
    return diffInMinutes;
  };

  const handleCall = (phoneNumber: string) => {
    const telUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(telUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(telUrl);
        } else {
          Alert.alert("Error", "Phone call not supported on this device");
        }
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred while trying to call");
      });
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancel Waiting",
      "Are you sure you want to cancel this guest?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => updateGuestStatus(id, "cancelled"),
        },
      ]
    );
  };
  const handleInLine = (id: string) => {
    setInLineGuests([...inLineGuests, id]);
  };

  const handleComplete = (id: string) => {
    // Move to seated status and remove from inLine state
    updateGuestStatus(id, "seated");
    setInLineGuests(inLineGuests.filter((guestId) => guestId !== id));
  };
  const handleSeated = (id: string) => {
    updateGuestStatus(id, "seated");
  };

  const renderItem = ({ item }: { item: Guest }) => {
    const waitedTime = calculateWaitedTime(item.registeredAt);
    const isInLine = inLineGuests.includes(item.id);
    return (
      <View
        style={[styles.guestItem, isInLine ? styles.inLineGuestItem : null]}
      >
        <View style={styles.guestDetails}>
          <View style={styles.guestContainer}>
            <View style={styles.guestInfo}>
              <View style={styles.iconContainer}>
                <Zocial
                  name="guest"
                  size={14}
                  style={[
                    styles.mainIcon,
                    isInLine ? styles.inLineGuestText : null,
                  ]}
                />
                <Text
                  style={[
                    styles.guestName,
                    isInLine ? styles.inlineGuestName : null,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="call-outline"
                  size={14}
                  style={[
                    styles.mainIcon,
                    isInLine ? styles.inLineGuestText : null,
                  ]}
                />
                <Text
                  style={[
                    styles.guestName,
                    isInLine ? styles.inLineGuestText : null,
                  ]}
                >
                  {item.phoneNumber}
                </Text>
              </View>
              <View style={styles.timeInfo}>
                <View style={styles.timeBlock}>
                  <MaterialIcons
                    name="access-time"
                    size={14}
                    style={[
                      styles.icon,
                      isInLine ? styles.inLineGuestText : null,
                    ]}
                  />
                  <Text
                    style={[
                      styles.timeText,
                      isInLine ? styles.inLineGuestText : null,
                    ]}
                  >
                    Registered At:{" "}
                    {format(parseISO(item.registeredAt), "hh:mm a")}
                  </Text>
                </View>
                <View style={styles.timeBlock}>
                  <Feather
                    name="clock"
                    size={14}
                    style={[
                      styles.icon,
                      isInLine ? styles.inLineGuestText : null,
                    ]}
                  />
                  <Text
                    style={[
                      styles.timeText,
                      isInLine ? styles.inLineGuestText : null,
                    ]}
                  >
                    Waiting Time: {waitedTime} Mins
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{item.guestCount}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <View style={styles.actionsContainer}>
              {!isInLine ? (
                <TouchableOpacity
                  style={styles.inLineButton}
                  onPress={() => handleInLine(item.id)}
                >
                  <Text style={styles.inLineText}>In Line</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleComplete(item.id)}
                >
                  <Text style={styles.completeText}>Complete</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(item.id)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(item.phoneNumber)}
            >
              {/* <MaterialIcons name="call" size={24} color="#000" /> */}
              <Ionicons name="call-outline" size={20} style={styles.mainIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {waitingGuests.length > 0 ? (
        <FlatList
          data={waitingGuests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="today" size={64} color="#DDD" />
          <Text style={styles.emptyStateText}>No Upcoming guests</Text>
          <Text style={styles.emptyStateSubtext}>
            Upcoming guests will appear here
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: { color: "#666" },
  mainIcon: { color: "#000" },
  listContent: {
    paddingBottom: 20,
  },
  guestItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  guestDetails: {
    flex: 1,
    flexDirection: "column",
  },
  guestContainer: {
    flexDirection: "row",
  },
  inLineGuestItem: {
    backgroundColor: "#6A96F2",
  },
  numberCircle: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // justifyContent: "center",
    // alignItems: "center",
    marginRight: 12,
  },
  completeButton: {
    backgroundColor: "#5CF34B",
    paddingVertical: 8,
    // paddingHorizontal: 16,
    borderRadius: 4,
    width: 100,
  },
  completeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  numberText: {
    color: "#000",
    fontSize: 40,
    fontFamily: "Poppins",

    fontWeight: "bold",
  },
  guestInfo: {
    flex: 1,
  },

  guestName: {
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: "Poppins",
  },
  inlineGuestName: {
    color: "#FFF",
    fontFamily: "Poppins",
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
  },
  guestPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginLeft: 4,
  },
  timeInfo: {
    flexDirection: "row",
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Poppins",
  },
  inLineGuestText: {
    color: "#FFF",
  },
  actions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  inLineButton: {
    backgroundColor: "#6A96F2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    width: 100,
  },
  inLineText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    // paddingHorizontal: 16,
    borderRadius: 4,
    width: 100,
  },
  cancelText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  callButton: {
    padding: 5,
    borderRadius: 4,
    backgroundColor: "#F6F1E9",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
  },
});

export default WaitingList;
