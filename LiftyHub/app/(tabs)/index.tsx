import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback} from "react-native";
import RoutineCard from "@/src/components/RoutineCard";
import FilterButton from "@/src/components/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Picker } from '@react-native-picker/picker';



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

// ---------------------- FILTROS ----------------------
const filters = ["Todo", "Fuerza", "Movilidad", "Cardio", "HIIT", "Core"];
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
    name: "Deltoides",
    category: "Fuerza",
    objective: "Aumentar fuerza hombros",
    duration: 60,
    level: "Moderado",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
    plan_id: 1,
    somatotype_id: 1
  },
  {
    id: 3,
    name: "Espalda",
    category: "Fuerza",
    objective: "Fortalecer espalda",
    duration: 50,
    level: "Intermedio",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
    plan_id: 1,
    somatotype_id: 3
  },
  {
    id: 4,
    name: "Pecho",
    category: "Fuerza",
    objective: "Aumentar fuerza pecho",
    duration: 45,
    level: "Principiante",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    plan_id: 1,
    somatotype_id: 2
  }
];

// ---------------------- COMPONENTE ----------------------
export default function RoutinesScreen() {

  const [routines, setRoutines] = useState<Routine[]>(routinesData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todo");
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

const filteredRoutines =
  selectedFilter === "Todo"
    ? routines
    : routines.filter((routine) => routine.category === selectedFilter);

  return (
    <View style={{ flex: 1 }}>
      {/* FLATLIST PRINCIPAL */}
      <FlatList
        style={styles.container}
        data={filteredRoutines}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Rutinas</Text>
              <Text style={styles.subtitle}>Enfocadas en tu progreso</Text>

              <TextInput
                placeholder="Buscar rutinas..."
                placeholderTextColor={colors.textSecondary}
                style={styles.search}
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
              keyExtractor={(item, index) => index.toString()}
              style={styles.filters}

              renderItem={({ item }) => (
  <FilterButton
    label={item}
    active={selectedFilter === item}
    onPress={() => setSelectedFilter(item)}
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
            image={item.img}
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
          Nueva Rutina
        </Text>

        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingVertical: 10 }}
        >

          {/* DATOS PRINCIPALES */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Datos principales
          </Text>

          {/* NOMBRE */}
          <TextInput
            placeholder="Nombre de la rutina"
            placeholderTextColor={colors.textSecondary}
            value={newRoutine.name}
            onChangeText={(text) =>
              setNewRoutine({ ...newRoutine, name: text })
            }
            style={styles.search2}
          />

          {/* OBJETIVO */}
          <TextInput
            placeholder="Objetivo de la rutina"
            placeholderTextColor={colors.textSecondary}
            value={newRoutine.objective}
            onChangeText={(text) =>
              setNewRoutine({ ...newRoutine, objective: text })
            }
            style={styles.search2}
          />

          {/* NIVEL */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Nivel de la rutina
          </Text>

          <View style={styles.levelContainer}>
            {["Principiante", "Intermedio", "Avanzado"].map((nivel) => (
              <TouchableOpacity
                key={nivel}
                style={[
                  styles.levelButton,
                  newRoutine.level === nivel && styles.levelButtonActive
                ]}
                onPress={() =>
                  setNewRoutine({ ...newRoutine, level: nivel })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    newRoutine.level === nivel && styles.levelTextActive
                  ]}
                >
                  {nivel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CATEGORÍA */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tipo de rutina
          </Text>

          <View style={styles.categoryContainer}>
            {["Fuerza", "Cardio", "Movilidad", "HIIT", "Full Body"].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  newRoutine.category === category && styles.levelButtonActive
                ]}
                onPress={() =>
                  setNewRoutine({ ...newRoutine, category })
                }
              >
                <Text
                  style={[
                    styles.levelText,
                    newRoutine.category === category && styles.levelTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DURACIÓN */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Duración
          </Text>

          <TextInput
            placeholder="Duración en minutos"
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
            Imagen
          </Text>

          <TextInput
            placeholder="URL de la imagen"
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

            if (!newRoutine.name || !newRoutine.objective || !newRoutine.level || !newRoutine.duration) {
              alert("Completa todos los campos antes de agregar la rutina");
              return;
            }

            setRoutines([
              ...routines,
              {
                id: Date.now(),
                ...newRoutine,
                name: newRoutine.name.trim(),
                objective: newRoutine.objective.trim()
              }
            ]);

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
            Agregar Rutina
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