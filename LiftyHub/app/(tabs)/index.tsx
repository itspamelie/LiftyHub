import { FlatList, View, Text, StyleSheet, TextInput } from "react-native";
import RoutineCard from "@/src/components/RoutineCard";
import FilterButton from "@/src/components/FilterButton";
import { colors, spacing } from "@/src/styles/globalstyles";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Routine = {
  title: string;
  duration: string;
  level: string;
  image: string;
};

const filters = [
  "Todo",
  "Fuerza",
  "Movilidad",
  "Cardio",
  "HIIT",
  "Core"
];

const routines: Routine[] = [
  {
    title: "Cuádriceps",
    duration: "40 min",
    level: "Principiante",
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
  },
  {
    title: "Deltoides",
    duration: "60 min",
    level: "Moderado",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
  },
  {
    title: "Espalda",
    duration: "50 min",
    level: "Intermedio",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
  },
  {
    title: "Pecho",
    duration: "45 min",
    level: "Principiante",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  }
];

export default function RoutinesScreen() {
  return (
    <View style={{ flex: 1 }}>
    <FlatList
      style={styles.container}
      data={routines}
      keyExtractor={(item, index) => index.toString()}
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

            <TouchableOpacity style={styles.addButton}>
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
            renderItem={({ item, index }) => (
              <FilterButton
                label={item}
                active={index === 0}
              />
            )}
          />
        </>
      }
      
      

      renderItem={({ item }) => (
        <RoutineCard
          title={item.title}
          duration={item.duration}
          level={item.level}
          image={item.image}
        />
      )}
    
      
    />
    
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  addButton: {
  position: "absolute",
    top: 30,
    right: 0,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
},

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40
  },

  header: {
    marginBottom: 20
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20
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

  filters: {
    marginBottom: 20
  }

});