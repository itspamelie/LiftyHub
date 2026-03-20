import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";

const NUTRITIONIST = {
  name: "Dra. Laura Pérez",
  specialty: "Nutricionista deportiva",
  location: "Ciudad de México, México",
  followers: 1240,
  connections: 318,
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  coverUrl: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=900&q=80",
  about:
    "Especialista en nutrición aplicada al rendimiento deportivo con más de 8 años de experiencia. Trabajo con atletas de alto rendimiento, entusiastas del fitness y personas que buscan mejorar su composición corporal de forma sostenible.",
  experience: [
    {
      id: 1,
      role: "Nutricionista deportiva",
      company: "LiftyHub Health",
      period: "2023 – Presente",
      icon: "barbell-outline",
    },
    {
      id: 2,
      role: "Consultora nutricional",
      company: "Clínica FitLife",
      period: "2019 – 2023",
      icon: "medkit-outline",
    },
    {
      id: 3,
      role: "Investigadora en nutrición",
      company: "UNAM — Facultad de Medicina",
      period: "2017 – 2019",
      icon: "flask-outline",
    },
  ],
  education: [
    {
      id: 1,
      degree: "Maestría en Nutrición Deportiva",
      school: "Universidad Iberoamericana",
      year: "2017",
    },
    {
      id: 2,
      degree: "Licenciatura en Nutriología",
      school: "UNAM",
      year: "2015",
    },
  ],
  skills: [
    "Planes de alimentación",
    "Composición corporal",
    "Suplementación deportiva",
    "Pérdida de grasa",
    "Hipertrofia muscular",
    "Nutrición clínica",
    "Coaching nutricional",
  ],
  rating: 4.9,
  reviews: 87,
};

export default function NutritionistProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* PORTADA */}
      <ImageBackground source={{ uri: NUTRITIONIST.coverUrl }} style={styles.cover}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
      </ImageBackground>

      {/* SECCIÓN PRINCIPAL */}
      <View style={styles.mainCard}>

        {/* AVATAR FLOTANTE */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: NUTRITIONIST.imageUrl }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>

        {/* ACCIONES */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="white" />
            <Text style={styles.btnPrimaryText}>Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary}>
            <Ionicons name="person-add-outline" size={16} color={colors.primary} />
            <Text style={styles.btnSecondaryText}>Conectar</Text>
          </TouchableOpacity>
        </View>

        {/* NOMBRE E INFO */}
        <Text style={styles.name}>{NUTRITIONIST.name}</Text>
        <Text style={styles.specialty}>{NUTRITIONIST.specialty}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.location}>{NUTRITIONIST.location}</Text>
        </View>

        {/* RATING */}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.floor(NUTRITIONIST.rating) ? "star" : "star-outline"}
              size={16}
              color="#F59E0B"
            />
          ))}
          <Text style={styles.ratingText}>
            {NUTRITIONIST.rating} · {NUTRITIONIST.reviews} reseñas
          </Text>
        </View>

        {/* SEGUIDORES */}
        <View style={styles.followRow}>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>{NUTRITIONIST.followers.toLocaleString()}</Text>
            <Text style={styles.followLabel}>Seguidores</Text>
          </View>
          <View style={styles.followDivider} />
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>{NUTRITIONIST.connections}</Text>
            <Text style={styles.followLabel}>Conexiones</Text>
          </View>
        </View>

      </View>

      {/* ACERCA DE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <Text style={styles.aboutText}>{NUTRITIONIST.about}</Text>
      </View>

      {/* EXPERIENCIA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiencia</Text>
        {NUTRITIONIST.experience.map((exp) => (
          <View key={exp.id} style={styles.expCard}>
            <View style={styles.expIcon}>
              <Ionicons name={exp.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.expInfo}>
              <Text style={styles.expRole}>{exp.role}</Text>
              <Text style={styles.expCompany}>{exp.company}</Text>
              <Text style={styles.expPeriod}>{exp.period}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* EDUCACIÓN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Educación</Text>
        {NUTRITIONIST.education.map((edu) => (
          <View key={edu.id} style={styles.expCard}>
            <View style={styles.expIcon}>
              <Ionicons name="school-outline" size={20} color="#10B981" />
            </View>
            <View style={styles.expInfo}>
              <Text style={styles.expRole}>{edu.degree}</Text>
              <Text style={styles.expCompany}>{edu.school}</Text>
              <Text style={styles.expPeriod}>{edu.year}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* HABILIDADES */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <Text style={styles.sectionTitle}>Especialidades</Text>
        <View style={styles.skillsWrap}>
          {NUTRITIONIST.skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  cover: {
    width: "100%",
    height: 200,
    justifyContent: "flex-start",
  },

  backBtn: {
    marginTop: 54,
    marginLeft: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  mainCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.screenPadding,
    marginTop: -50,
    borderRadius: spacing.borderRadius,
    padding: 16,
    paddingTop: 60,
    marginBottom: 16,
  },

  avatarWrapper: {
    position: "absolute",
    top: -50,
    left: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.card,
  },

  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: colors.card,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 12,
  },

  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnPrimaryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnSecondaryText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },

  specialty: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },

  location: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },

  ratingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 4,
  },

  followRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 14,
    gap: 0,
  },

  followItem: {
    flex: 1,
    alignItems: "center",
  },

  followDivider: {
    width: 1,
    backgroundColor: "#2A2A2A",
  },

  followNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },

  followLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.screenPadding,
    borderRadius: spacing.borderRadius,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },

  aboutText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  expCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },

  expIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#0F0F10",
    justifyContent: "center",
    alignItems: "center",
  },

  expInfo: {
    flex: 1,
  },

  expRole: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  expCompany: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  expPeriod: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },

  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skillChip: {
    backgroundColor: "#0F1B2D",
    borderWidth: 1,
    borderColor: "#1D4ED8",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  skillText: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "500",
  },

});
