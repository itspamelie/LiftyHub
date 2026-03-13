import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Stack, router } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";

export default function EditProfileScreen() {

  const [name, setName] = useState("David Vega");
  const [height, setHeight] = useState("1.78");
  const [somatotype, setSomatotype] = useState("Mesomorfo");
  const [goal, setGoal] = useState("Ganar músculo");

  return (

    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      {/* BOTÓN BACK */}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>

        {/* AVATAR */}

        <View style={styles.avatarSection}>

          <Image
            source={require("@/src/assets/defaultd.png")}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.changePhoto}>
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.changePhotoText}>
              Cambiar foto
            </Text>
          </TouchableOpacity>

        </View>

        {/* DATOS PERSONALES */}

        <Text style={styles.section}>Datos personales</Text>

        <View style={styles.card}>

          <View style={styles.row}>

            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Nombre</Text>
            </View>

            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={colors.textSecondary}
            />

          </View>

        </View>

        {/* INFORMACIÓN FÍSICA */}

        <Text style={styles.section}>Información física</Text>

        {/* ALTURA */}

        <View style={styles.card}>

          <View style={styles.row}>

            <View style={styles.rowLeft}>
              <Ionicons name="resize-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Altura</Text>
            </View>

            <TextInput
              value={height}
              onChangeText={setHeight}
              style={styles.input}
              keyboardType="numeric"
              placeholder="m"
              placeholderTextColor={colors.textSecondary}
            />

          </View>

        </View>

        {/* SOMATOTIPO */}

        <View style={styles.card}>

          <View style={styles.rowColumn}>

            <View style={styles.rowLeft}>
              <Ionicons name="body-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Somatotipo</Text>
            </View>

            <View style={styles.selectorContainer}>

              {["Ectomorfo", "Mesomorfo", "Endomorfo"].map((type) => (

                <TouchableOpacity
                  key={type}
                  style={[
                    styles.selectorButton,
                    somatotype === type && styles.selectorButtonActive
                  ]}
                  onPress={() => setSomatotype(type)}
                >

                  <Text
                    style={[
                      styles.selectorText,
                      somatotype === type && styles.selectorTextActive
                    ]}
                  >
                    {type}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>

          </View>

        </View>

        {/* OBJETIVO */}

        <View style={styles.card}>

          <View style={styles.rowColumn}>

            <View style={styles.rowLeft}>
              <Ionicons name="flag-outline" size={20} color={colors.text} />
              <Text style={styles.label}>Objetivo</Text>
            </View>

            <View style={styles.selectorContainer}>

              {[
                "Perder grasa",
                "Ganar músculo",
                "Recomposición corporal",
                "Mantenerme en forma"
              ].map((item) => (

                <TouchableOpacity
                  key={item}
                  style={[
                    styles.selectorButton,
                    goal === item && styles.selectorButtonActive
                  ]}
                  onPress={() => setGoal(item)}
                >

                  <Text
                    style={[
                      styles.selectorText,
                      goal === item && styles.selectorTextActive
                    ]}
                  >
                    {item}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>

          </View>

        </View>

        {/* BOTÓN GUARDAR */}

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>
            Guardar cambios
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
  padding: spacing.screenPadding,
  paddingBottom: 120
},
  divider: {
  height: 1,
  backgroundColor: "#2A2A2A",
  marginHorizontal: 18
},

  editButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 40
  },

  avatar: {
  width: 180,
  height: 180,
  borderRadius: 90,
  borderWidth: 3,
  borderColor: colors.background,
  marginBottom: 12
},

  changePhoto: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.borderRadius
  },

  changePhotoText: {
  color: "white",
  marginLeft: 6,
  fontWeight: "600",
  fontSize: 14
},

  section: {
  color: colors.textSecondary,
  fontSize: 13,
  marginBottom: 8,
  marginTop: 20,
  fontWeight: "600",
  textTransform: "uppercase"
},

  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.borderRadius,
    marginBottom: 20
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18
  },

  rowColumn: {
    padding: 18
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  label: {
  color: colors.text,
  fontSize: 16,
  marginLeft: 10
},

 input: {
  color: colors.text,
  fontSize: 16,
  width: 120,
  textAlign: "right"
},

  selectorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14
  },

  selectorButton: {
  backgroundColor: colors.background,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: spacing.borderRadius,
  marginRight: 10,
  marginBottom: 10
},
  selectorButtonActive: {
    backgroundColor: colors.primary
  },

selectorText: {
  color: colors.textSecondary,
  fontSize: 14,
  fontWeight: "600"
},

  selectorTextActive: {
  color: "white",
  fontSize: 14,
  fontWeight: "600"
},

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30
  },

  saveText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold"
}

});