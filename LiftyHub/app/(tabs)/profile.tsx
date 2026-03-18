import { ScrollView, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/src/styles/globalstyles";
import ProgressCard from "@/src/components/ProgressCard";
import InfoStatCard from "@/src/components/InfoStatCard";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


// función para calcular la edad
const calculateAge = (birthdate: string) => {
  const today = new Date();
  const birth = new Date(birthdate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};


export default function ProfileScreen() {

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {

    const loadUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    // 👇 AQUÍ
    console.log("TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN");
      return;
    }

    const res = await fetch("http://192.168.137.154:8000/api/users/1", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
    });

    console.log("STATUS:", res.status);

    const response = await res.json();
    console.log("RAW RESPONSE:", response);

    const user = response.data ?? response;

    setProfile({
      name: user.name,
      age: user.birthdate ? calculateAge(user.birthdate) : "N/A",
      avatar: require("@/src/assets/defaultd.png"),
      routinesCount: 24,
      weight: 78,
      streak: 12,
      height: 1.78,
      somatotype: "Mesomorfo",
      goal: "Ganar músculo"
    });

  } catch (error) {
    console.log("ERROR FETCH:", error);
  }
};

    loadUser();

  }, []);


  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Cargando perfil...</Text>
      </View>
    );
  }
  return (

    <View style={styles.container}>



      {/* BOTÓN EDITAR */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
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
              source={profile.avatar}
              style={styles.avatar}
            />

            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subtitle}>{profile.age} años</Text>

          </View>

          {/* TARJETA DE ESTADÍSTICAS */}
          <View style={styles.statsCard}>

            <View style={styles.stat}>
              <Ionicons name="barbell" size={24} color={colors.text} />
              <Text style={styles.statNumber}>{profile.routinesCount}</Text>
              <Text style={styles.statLabel}>Rutinas</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="scale" size={24} color={colors.text} />
              <Text style={styles.statNumber}>{profile.weight} kg</Text>
              <Text style={styles.statLabel}>Peso</Text>
            </View>

            <View style={styles.stat}>
              <Ionicons name="flame" size={24} color={colors.text} />
              <Text style={styles.statNumber}>{profile.streak}</Text>
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
              value={`${profile.height} m`}
            />

            <InfoStatCard
              icon="scale"
              label="Peso"
              value={`${profile.weight} kg`}
            />

            <InfoStatCard
              icon="body"
              label="Somatotipo"
              value={profile.somatotype}
            />

            <InfoStatCard
              icon="flag"
              label="Objetivo"
              value={profile.goal}
            />

          </View>

        </View>

      </ScrollView>

    </View>
  );
}

// -------- ESTILOS ---------
// -------- ESTILOS ---------
// -------- ESTILOS ---------

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
    fontSize: 24,
    fontWeight: "bold"
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4
  },

  statsCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },

  stat: {
    alignItems: "center",
    gap: 4
  },

  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold"
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 13
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10
  }

});

// -------- ESTILOS ---------
// -------- ESTILOS ---------
// -------- ESTILOS ---------