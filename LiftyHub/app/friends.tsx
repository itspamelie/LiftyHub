import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";

const FAKE_FRIENDS = [
  { id: 1, name: "Carlos Méndez",   streak: 12, workouts: 48, avatar: null },
  { id: 2, name: "Sofía Ramírez",   streak: 7,  workouts: 31, avatar: null },
  { id: 3, name: "Diego Torres",    streak: 21, workouts: 90, avatar: null },
  { id: 4, name: "Valeria Fuentes", streak: 3,  workouts: 15, avatar: null },
];

const FAKE_REQUESTS = [
  { id: 5, name: "Andrés López",  avatar: null },
  { id: 6, name: "Mariana Vega",  avatar: null },
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>Amigos</Text>
        <HapticButton style={styles.addBtn}>
          <Ionicons name="person-add" size={20} color={colors.primary} />
        </HapticButton>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Solicitudes */}
        {FAKE_REQUESTS.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
            <View style={styles.card}>
              {FAKE_REQUESTS.map((req, i) => (
                <View key={req.id}>
                  <View style={styles.requestRow}>
                    <Avatar name={req.name} />
                    <Text style={styles.friendName}>{req.name}</Text>
                    <View style={styles.requestActions}>
                      <HapticButton style={styles.acceptBtn}>
                        <Ionicons name="checkmark" size={18} color="white" />
                      </HapticButton>
                      <HapticButton style={styles.rejectBtn}>
                        <Ionicons name="close" size={18} color={colors.textSecondary} />
                      </HapticButton>
                    </View>
                  </View>
                  {i < FAKE_REQUESTS.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Amigos */}
        <Text style={styles.sectionTitle}>Mis amigos ({FAKE_FRIENDS.length})</Text>
        <View style={styles.card}>
          {FAKE_FRIENDS.map((friend, i) => (
            <View key={friend.id}>
              <View style={styles.friendRow}>
                <Avatar name={friend.name} />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <View style={styles.friendStats}>
                    <Ionicons name="flame" size={13} color="#F59E0B" />
                    <Text style={styles.friendStatText}>{friend.streak} racha</Text>
                    <Text style={styles.friendStatDot}>·</Text>
                    <Ionicons name="barbell" size={13} color={colors.primary} />
                    <Text style={styles.friendStatText}>{friend.workouts} entrenos</Text>
                  </View>
                </View>
                <HapticButton>
                  <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
                </HapticButton>
              </View>
              {i < FAKE_FRIENDS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Placeholder próximamente */}
        <View style={styles.comingSoonBox}>
          <Ionicons name="trophy-outline" size={28} color={colors.primary} />
          <Text style={styles.comingSoonTitle}>Retos entre amigos</Text>
          <Text style={styles.comingSoonSub}>Próximamente podrás retar a tus amigos y ver quién entrena más.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
  },

  content: { padding: spacing.screenPadding, paddingBottom: 40, gap: 12 },

  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
  },

  divider: { height: 1, backgroundColor: colors.background },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + "33",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: colors.primary, fontWeight: "700", fontSize: 15 },

  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  friendInfo: { flex: 1 },
  friendName: { color: colors.text, fontSize: 15, fontWeight: "600" },
  friendStats: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  friendStatText: { color: colors.textSecondary, fontSize: 12 },
  friendStatDot: { color: colors.textSecondary, fontSize: 12 },

  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  requestActions: { flexDirection: "row", gap: 8 },
  acceptBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.textSecondary + "44",
    justifyContent: "center",
    alignItems: "center",
  },

  comingSoonBox: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  comingSoonTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  comingSoonSub: { color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 18 },
});
