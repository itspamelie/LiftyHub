import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { colors, spacing } from "@/src/styles/globalstyles";
import HapticButton from "@/src/components/buttons/HapticButton";
import OfflineBanner from "@/src/components/OfflineBanner";
import { useLanguage } from "@/src/context/LanguageContext";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveCache, loadCache } from "@/src/utils/cache";
import * as Storage from "@/src/utils/storage";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  searchUsers,
} from "@/src/services/api";

type Friend = {
  id: number;
  user_id: number;
  name: string;
  avatar: string | null;
  streak: number;
  workouts: number;
};

type FriendRequest = {
  id: number;
  name: string;
  avatar: string | null;
};

type SearchUser = {
  id: number;
  name: string;
  email: string;
  img: string | null;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export default function FriendsScreen() {
  const { t } = useLanguage();
  const isConnected = useNetworkStatus();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      const raw = await Storage.getItem("user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          setCurrentUserId(u.id);
        } catch {}
      }
      await loadData();
    };
    init();
  }, []);

  const loadData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const token = await Storage.getItem("token");
      if (!token) return;

      const [friendsRes, requestsRes] = await Promise.allSettled([
        getFriends(token),
        getFriendRequests(token),
      ]);

      if (friendsRes.status === "fulfilled" && friendsRes.value?.data) {
        setFriends(friendsRes.value.data);
        saveCache("friends_list", friendsRes.value.data);
      } else {
        const cached = await loadCache<Friend[]>("friends_list");
        if (cached) setFriends(cached);
      }

      if (requestsRes.status === "fulfilled" && requestsRes.value?.data) {
        setRequests(requestsRes.value.data);
        saveCache("friends_requests", requestsRes.value.data);
      } else {
        const cached = await loadCache<FriendRequest[]>("friends_requests");
        if (cached) setRequests(cached);
      }
    } catch {
      const cachedFriends = await loadCache<Friend[]>("friends_list");
      const cachedRequests = await loadCache<FriendRequest[]>("friends_requests");
      if (cachedFriends) setFriends(cachedFriends);
      if (cachedRequests) setRequests(cachedRequests);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const handleAccept = async (id: number) => {
    try {
      const token = await Storage.getItem("token");
      if (!token) return;
      await acceptFriendRequest(id, token);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      loadData(true);
    } catch {
      Alert.alert(t("friends.errorAction"));
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = await Storage.getItem("token");
      if (!token) return;
      await removeFriend(id, token);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      Alert.alert(t("friends.errorAction"));
    }
  };

  const handleDeleteFriend = (id: number, name: string) => {
    Alert.alert(
      t("friends.removeTitle"),
      t("friends.removeMessage").replace("%{name}", name),
      [
        { text: t("friends.cancel"), style: "cancel" },
        {
          text: t("friends.removeConfirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const token = await Storage.getItem("token");
              if (!token) return;
              await removeFriend(id, token);
              setFriends((prev) => prev.filter((f) => f.id !== id));
            } catch {
              Alert.alert(t("friends.errorAction"));
            }
          },
        },
      ]
    );
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const token = await Storage.getItem("token");
        if (!token) return;
        const res = await searchUsers(query, token);
        const all: SearchUser[] = res?.data ?? [];
        setSearchResults(all.filter((u) => u.id !== currentUserId));
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  const handleSendRequest = async (user: SearchUser) => {
    try {
      const token = await Storage.getItem("token");
      if (!token) return;
      await sendFriendRequest(user.id, token);
      setSentRequests((prev) => new Set(prev).add(user.id));
      Alert.alert(
        t("friends.sendRequest"),
        t("friends.requestSent").replace("%{name}", user.name)
      );
    } catch {
      Alert.alert(t("friends.sendRequest"), t("friends.requestError"));
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setSentRequests(new Set());
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {!isConnected && <OfflineBanner />}

      {/* Header */}
      <View style={styles.header}>
        <HapticButton style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </HapticButton>
        <Text style={styles.headerTitle}>{t("friends.title")}</Text>
        <HapticButton style={styles.addBtn} onPress={() => setShowSearch(true)}>
          <Ionicons name="person-add" size={20} color={colors.primary} />
        </HapticButton>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Solicitudes pendientes */}
        {requests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t("friends.requests")}</Text>
            <View style={styles.card}>
              {requests.map((req, i) => (
                <View key={req.id}>
                  <View style={styles.requestRow}>
                    <Avatar name={req.name} />
                    <Text style={[styles.friendName, { flex: 1 }]}>{req.name}</Text>
                    <View style={styles.requestActions}>
                      <HapticButton
                        style={styles.acceptBtn}
                        onPress={() => handleAccept(req.id)}
                      >
                        <Ionicons name="checkmark" size={18} color="white" />
                      </HapticButton>
                      <HapticButton
                        style={styles.rejectBtn}
                        onPress={() => handleReject(req.id)}
                      >
                        <Ionicons name="close" size={18} color={colors.textSecondary} />
                      </HapticButton>
                    </View>
                  </View>
                  {i < requests.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Lista de amigos */}
        <Text style={styles.sectionTitle}>
          {t("friends.myFriends").replace("%{count}", String(friends.length))}
        </Text>

        {friends.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={44} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>{t("friends.noFriends")}</Text>
            <Text style={styles.emptyHint}>{t("friends.noFriendsHint")}</Text>
            <HapticButton style={styles.emptyBtn} onPress={() => setShowSearch(true)}>
              <Ionicons name="person-add" size={15} color="white" />
              <Text style={styles.emptyBtnText}>{t("friends.addFriend")}</Text>
            </HapticButton>
          </View>
        ) : (
          <View style={styles.card}>
            {friends.map((friend, i) => (
              <View key={friend.id}>
                <View style={styles.friendRow}>
                  <Avatar name={friend.name} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <View style={styles.friendStats}>
                      <Ionicons name="flame" size={13} color="#F59E0B" />
                      <Text style={styles.friendStatText}>
                        {friend.streak} {t("friends.streak")}
                      </Text>
                      <Text style={styles.friendStatDot}>·</Text>
                      <Ionicons name="barbell" size={13} color={colors.primary} />
                      <Text style={styles.friendStatText}>
                        {friend.workouts} {t("friends.workouts")}
                      </Text>
                    </View>
                  </View>
                  <HapticButton
                    onPress={() => handleDeleteFriend(friend.id, friend.name)}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </HapticButton>
                </View>
                {i < friends.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}

        {/* Próximamente */}
        <View style={styles.comingSoonBox}>
          <Ionicons name="trophy-outline" size={28} color={colors.primary} />
          <Text style={styles.comingSoonTitle}>{t("friends.comingSoonTitle")}</Text>
          <Text style={styles.comingSoonSub}>{t("friends.comingSoonSub")}</Text>
        </View>
      </ScrollView>

      {/* Modal búsqueda de usuarios */}
      <Modal
        visible={showSearch}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeSearch}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("friends.searchTitle")}</Text>
            <HapticButton onPress={closeSearch}>
              <Ionicons name="close" size={24} color={colors.text} />
            </HapticButton>
          </View>

          {/* Buscador */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("friends.searchPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <HapticButton onPress={() => handleSearchChange("")}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </HapticButton>
            )}
          </View>

          {/* Contenido */}
          {searchLoading ? (
            <ActivityIndicator
              style={{ marginTop: 48 }}
              size="large"
              color={colors.primary}
            />
          ) : searchQuery.trim() === "" ? (
            <View style={styles.searchHintBox}>
              <Ionicons name="search-outline" size={44} color={colors.textSecondary} />
              <Text style={styles.searchHintText}>{t("friends.searchHint")}</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.searchHintBox}>
              <Ionicons name="person-outline" size={44} color={colors.textSecondary} />
              <Text style={styles.searchHintText}>{t("friends.searchEmpty")}</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.searchResults}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.card}>
                {searchResults.map((user, i) => {
                  const alreadySent = sentRequests.has(user.id);
                  return (
                    <View key={user.id}>
                      <View style={styles.searchResultRow}>
                        <Avatar name={user.name} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.friendName}>{user.name}</Text>
                          <Text style={styles.searchEmail}>{user.email}</Text>
                        </View>
                        <HapticButton
                          style={alreadySent ? styles.sentBtn : styles.addRequestBtn}
                          onPress={() => !alreadySent && handleSendRequest(user)}
                        >
                          <Text style={styles.addRequestBtnText}>
                            {alreadySent
                              ? t("friends.alreadySent")
                              : t("friends.sendRequest")}
                          </Text>
                        </HapticButton>
                      </View>
                      {i < searchResults.length - 1 && <View style={styles.divider} />}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

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
  friendStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
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

  emptyBox: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  emptyHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  emptyBtnText: { color: "white", fontSize: 14, fontWeight: "600" },

  comingSoonBox: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  comingSoonTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  comingSoonSub: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  // Modal
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: "bold" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  searchHintBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingBottom: 60,
  },
  searchHintText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  searchResults: { paddingHorizontal: 16, paddingBottom: 40 },

  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  searchEmail: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  addRequestBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  sentBtn: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.textSecondary + "44",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  addRequestBtnText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});
