import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback} from "react-native";
import RoutineCard from "@/src/components/routines/RoutineCard";
import FilterButton from "@/src/components/exercises/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { Keyboard } from "react-native";
import { useLanguage } from "@/src/context/LanguageContext";

const defaultImages = [
  "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a",
  "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a"
];
const getRandomImage = () => {
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

// ---------------------- TIPO ----------------------
type Routine = {
  id: number;
  name: string;
  category: string;
  objective: string;
  level: string;
  duration: number;
  img: string;
  plan_id: number;
  somatotype_id: number;
};

const routinesData: Routine[] = [
  {
    id: 1,
    name: "Cuádriceps",
    category: "Fuerza",
    objective: "Fortalecer piernas",
    duration: 40,
    level: "Principiante",
    img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
    plan_id: 1,
    somatotype_id: 2
  },
  {
    id: 2,
    name: "HIIT explosivo",
    category: "HIIT",
    objective: "Quemar grasa",
    duration: 25,
    level: "Intermedio",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    plan_id: 1,
    somatotype_id: 1
  },
  {
    id: 3,
    name: "Movilidad cadera",
    category: "Movilidad",
    objective: "Mejorar movilidad",
    duration: 15,
    level: "Principiante",
    img: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a",
    plan_id: 1,
    somatotype_id: 3
  },
  {
    id: 4,
    name: "Cardio ligero",
    category: "Cardio",
    objective: "Resistencia",
    duration: 30,
    level: "Principiante",
    img: "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
    plan_id: 1,
    somatotype_id: 2
  }
];

// ---------------------- COMPONENTE ----------------------
export default function RoutinesScreen() {

  const { t } = useLanguage();
  const listRef = useRef<FlatList>(null);

  const filters = [
    { key: "Todo",     label: t("routines.categories.all") },
    { key: "Fuerza",   label: t("routines.categories.strength") },
    { key: "Movilidad",label: t("routines.categories.mobility") },
    { key: "Cardio",   label: t("routines.categories.cardio") },
    { key: "HIIT",     label: t("routines.categories.hiit") },
    { key: "Full Body",label: t("routines.categories.fullBody") },
  ];

  const levels = [
    { key: "Principiante", label: t("routines.levels.beginner") },
    { key: "Intermedio",   label: t("routines.levels.intermediate") },
    { key: "Avanzado",     label: t("routines.levels.advanced") },
  ];
  const [routines, setRoutines] = useState<Routine[]>(routinesData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [search, setSearch] = useState("");
  const [newRoutine, setNewRoutine] = useState<Omit<Routine, "id">>({
  name: "",
  category: "",
  objective: "",
  level: "",
  duration: 0,
  img: "",
  plan_id: 0,
  somatotype_id: 0
});

const filteredRoutines = routines.filter((routine) => {

  const matchCategory =
    selectedFilter === "Todo" || routine.category === selectedFilter;

  const matchSearch =
    routine.name.toLowerCase().includes(search.toLowerCase());

  return matchCategory && matchSearch;

});

  return (
    <View style={{ flex: 1 }}>
      {/* FLATLIST PRINCIPAL */}
      <FlatList
      ref={listRef}
  style={styles.container}
  data={filteredRoutines}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={styles.content}
  ListEmptyComponent={
  <View style={styles.emptyContainer}>
    <Ionicons name="barbell-outline" size={60} color={colors.textSecondary} />
    <Text style={styles.emptyTitle}>{t("routines.empty")}</Text>
    <Text style={styles.emptyText}>{t("routines.emptyHint")}</Text>
  </View>
}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>{t("routines.title")}</Text>
              <Text style={styles.subtitle}>{t("routines.subtitle")}</Text>

              <TextInput
  placeholder={t("routines.search")}
  placeholderTextColor={colors.textSecondary}
  style={styles.search}
  value={search}
  onChangeText={setSearch}
/>

              {/* BOTÓN PARA ABRIR MODAL */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* FILTROS */}
            <FlatList
              data={filters}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.key}
              style={styles.filters}

              renderItem={({ item }) => (
  <FilterButton
    label={item.label}
    active={selectedFilter === item.key}
    onPress={() => setSelectedFilter(item.key)}
  />
)}
            />
          </>
        }
        renderItem={({ item }) => (
          <RoutineCard
            title={item.name}
  duration={`${item.duration} min`}
  level={item.level}
  category={item.category}
            image={
  item.img ||
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
}
          />
        )}
      />

      {/* MODAL PARA AGREGAR RUTINA */}
      {/* MODAL PARA AGREGAR RUTINA */}
      {/* MODAL PARA AGREGAR RUTINA */}
<Modal visible={modalVisible} animationType="slide" transparent>

  <TouchableOpacity
    style={styles.modalBackground}
    activeOpacity={1}
    onPress={() => setModalVisible(false)}
  >

    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={styles.modalContainer}>

        {/* BOTÓN CANCELAR ARRIBA */}
        <TouchableOpacity
          style={styles.addButton2}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <Text style={[styles.modalTitle, { color: colors.text }]}>
          {t("routines.modal.title")}
        </Text>

        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingVertical: 10 }}
        >

          {/* DATOS PRINCIPALES */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("routines.modal.section")}
          </Text>

          {/* NOMBRE */}
          <TextInput
            placeholder={t("routines.modal.name")}
            placeholderTextColor={colors.textSecondary}
            value={newRoutine.name}
            onChangeText={(text) =>
              setNewRoutine({ ...newRoutine, name: text })
            }
            style={styles.search2}
          />

          {/* OBJETIVO */}
          <TextInput
            placeholder={t("routines.modal.objective")}
            placeholderTextColor={colors.textSecondary}
            value={newRoutine.objective}
            onChangeText={(text) =>
              setNewRoutine({ ...newRoutine, objective: text })
            }
            style={styles.search2}
          />

          {/* NIVEL */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("routines.modal.level")}
          </Text>

          <View style={styles.levelContainer}>
            {levels.map((nivel) => (
              <TouchableOpacity
                key={nivel.key}
                style={[
                  styles.levelButton,
                  newRoutine.level === nivel.key && styles.levelButtonActive
                ]}
                onPress={() =>
                  setNewRoutine({ ...newRoutine, level: nivel.key })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    newRoutine.level === nivel.key && styles.levelTextActive
                  ]}
                >
                  {nivel.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CATEGORÍA */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("routines.modal.type")}
          </Text>

          <View style={styles.categoryContainer}>
            {filters.slice(1).map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryButton,
                  newRoutine.category === cat.key && styles.levelButtonActive
                ]}
                onPress={() =>
                  setNewRoutine({ ...newRoutine, category: cat.key })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    newRoutine.category === cat.key && styles.levelTextActive
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DURACIÓN */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("routines.modal.duration")}
          </Text>

          <TextInput
            placeholder={t("routines.modal.durationPlaceholder")}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
            value={newRoutine.duration ? newRoutine.duration.toString() : ""}
            onChangeText={(text) =>
              setNewRoutine({ ...newRoutine, duration: Number(text) })
            }
            style={styles.search2}
          />

          {/* IMAGEN */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("routines.modal.image")}
          </Text>

          <TextInput
            placeholder={t("routines.modal.imagePlaceholder")}
            placeholderTextColor={colors.textSecondary}
            value={newRoutine.img}
            onChangeText={(text) =>
              setNewRoutine({ ...newRoutine, img: text })
            }
            style={styles.search2}
          />

        </ScrollView>

        {/* BOTÓN AGREGAR */}
        <TouchableOpacity
          style={styles.addRoutineButton}
          onPress={() => {

            if (
  !newRoutine.name ||
  !newRoutine.objective ||
  !newRoutine.level ||
  !newRoutine.duration ||
  !newRoutine.category
) {
  alert(t("routines.modal.errorEmpty"));
  return;
}

          setRoutines([
  {
    id: Date.now(),
    ...newRoutine,
    img: newRoutine.img || getRandomImage(),
    name: newRoutine.name.trim(),
    objective: newRoutine.objective.trim()
  },
  ...routines
]);
listRef.current?.scrollToOffset({ offset: 0, animated: true });
            Keyboard.dismiss();  
            setModalVisible(false);

            setNewRoutine({
              name: "",
              category: "",
              objective: "",
              level: "",
              duration: 0,
              img: "",
              plan_id: 0,
              somatotype_id: 0
            });

          }}
        >
          <Text style={styles.modalButtonText}>
            {t("routines.modal.button")}
          </Text>
        </TouchableOpacity>

      </View>
    </TouchableWithoutFeedback>

  </TouchableOpacity>

</Modal>

{/* FINAL MODAL PARA AGREGAR RUTINA */}
{/* FINAL MODAL PARA AGREGAR RUTINA */}
{/* FINAL MODAL PARA AGREGAR RUTINA */}
    </View>
  );
}

// ---------------------- ESTILOS ----------------------
// ---------------------- ESTILOS ----------------------
// ---------------------- ESTILOS ----------------------

const styles = StyleSheet.create({
  emptyContainer: {
  alignItems: "center",
  marginTop: 60
},

emptyTitle: {
  color: colors.text,
  fontSize: 18,
  fontWeight: "600",
  marginTop: 10
},

emptyText: {
  color: colors.textSecondary,
  marginTop: 5,
  textAlign: "center"
},

  categoryContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: 12
},
categoryButton: {
  backgroundColor: colors.card,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: spacing.borderRadius,
  alignItems: "center",
  margin: 4
},


// ---------------------- picker  intermedio avanzado basico----------------------
 levelContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12
},

levelButton: {
  flex: 1,
  backgroundColor: colors.card,
  paddingVertical: 12,
  borderRadius: spacing.borderRadius,
  alignItems: "center",
  marginHorizontal: 4
},

levelButtonActive: {
  backgroundColor: colors.primary
},

levelText: {
  color: colors.textSecondary,
  fontWeight: "600"
},

levelTextActive: {
  color: "white"
},
// ---------------------- picker  intermedio avanzado basico ----------------------
  // ---------------------- FLATLIST ----------------------
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40
  },

  // ---------------------- HEADER ----------------------
  header: {
    marginBottom: 20
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16
  },
  search: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16
  },

  // ---------------------- FILTROS ----------------------
  filters: {
    marginBottom: 20
  },

  // ---------------------- BOTÓN ADD ----------------------
  addButton: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },
  addButton2: {
    position: "absolute",
    top: 10,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  // ---------------------- MODAL ----------------------
modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center'
},
modalContainer: {
  width: '90%',
  borderRadius: 12,
  padding: 20,
  maxHeight: '90%',
  backgroundColor: colors.background
},
backButton: {
  position: 'absolute',
  top: 15,
  left: 15,
  zIndex: 10
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center'
},
sectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginTop: 10,
  marginBottom: 5
},

search2: {
  backgroundColor: colors.card,
  borderRadius: spacing.borderRadius,
  paddingHorizontal: 16,
  paddingVertical: 12,
  color: colors.text,
  fontSize: 16,
  marginBottom: 12
},
addRoutineButton: {
  backgroundColor: colors.primary,
  borderRadius: spacing.borderRadius,
  paddingVertical: 12,
  paddingHorizontal: 16,
  alignItems: 'center',
  marginTop: 10
},
modalButtonText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: "white"
}

});
// ---------------------- ESTILOS ----------------------
// ---------------------- ESTILOS ----------------------
// ---------------------- ESTILOS ----------------------