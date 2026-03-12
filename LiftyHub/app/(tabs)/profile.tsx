import { ScrollView, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import ProgressCard from "@/src/components/ProgressCard";
import InfoStatCard from "@/src/components/InfoStatCard";

export default function ProfileScreen() {
  return (

    <View style={styles.container}>

      {/* BOTÓN EDITAR */}
      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="pencil" size={20} color="white" />
      </TouchableOpacity>

      <ScrollView>

        {/* PORTADA */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
          }}
          style={styles.cover}
        />

        {/* CONTENIDO */}
        <View style={styles.content}>

          {/* HEADER */}
          <View style={styles.header}>

            <Image
              source={require("@/src/assets/defaultd.png")}
              style={styles.avatar}
            />

            <Text style={styles.name}>David Laid</Text>
            <Text style={styles.subtitle}>New York City</Text>

          </View>

          {/* TARJETA DE ESTADÍSTICAS */}
          <View style={styles.statsCard}>

            <View style={styles.stat}>
              <Ionicons name="barbell" size={24} color={colors.text} />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Rutinas</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="scale" size={24} color={colors.text} />
              <Text style={styles.statNumber}>80 kg</Text>
              <Text style={styles.statLabel}>Peso</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="flame" size={24} color={colors.text} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>

          </View>

          {/* PROGRESO */}
          <ProgressCard
            progress={75}
            workouts={6}
            reps={420}
            sets={45}
          />

          {/* INFORMACIÓN FÍSICA */}
          <Text style={styles.title}>Información física</Text>

          <View style={styles.infoGrid}>

            <InfoStatCard
              icon="resize"
              label="Altura"
              value="1.78 m"
            />

            <InfoStatCard
              icon="scale"
              label="Peso"
              value="80 kg"
            />

            <InfoStatCard
              icon="body"
              label="Somatotipo"
              value="Mesomorfo"
            />

            <InfoStatCard
              icon="flag"
              label="Objetivo"
              value="Ganar músculo"
            />

          </View>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  editButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  cover: {
    width: "100%",
    height: 200
  },

  content: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
    marginTop: -50
  },

  header: {
    alignItems: "center",
    marginBottom: 10
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.background,
    marginTop: -70
  },

  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold"
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4
  },

  statsCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  stat: {
    alignItems: "center"
  },

  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6
  },

  statLabel: {
    color: colors.textSecondary,
    marginTop: 4
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10
  }

});