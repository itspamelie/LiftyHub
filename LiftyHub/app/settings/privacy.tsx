import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { colors, spacing } from "@/src/styles/globalstyles";
import BackButton from "@/src/components/buttons/backButton";

export default function PrivacyScreen() {

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <BackButton />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Política de privacidad</Text>
        <Text style={styles.date}>Última actualización: marzo 2026</Text>

        <Text style={styles.section}>1. Introducción</Text>
        <Text style={styles.text}>
          En LiftyHub nos comprometemos a proteger tu privacidad. Esta política
          describe cómo recopilamos, usamos y protegemos tu información personal
          de conformidad con la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares (LFPDPPP) de México.
        </Text>

        <Text style={styles.section}>2. Datos que recopilamos</Text>
        <Text style={styles.text}>
          Al usar LiftyHub recopilamos la siguiente información:
        </Text>
        <Text style={styles.bullet}>• Datos de cuenta: nombre, correo electrónico y contraseña.</Text>
        <Text style={styles.bullet}>• Datos personales: género, fecha de nacimiento y fotografía de perfil.</Text>
        <Text style={styles.bullet}>• Datos físicos: peso, altura, medidas corporales (cintura, pecho, caderas, brazos, hombros, muslos) y somatotipo.</Text>
        <Text style={styles.bullet}>• Datos de entrenamiento: rutinas, ejercicios, series, repeticiones, pesos y registro de actividad.</Text>
        <Text style={styles.bullet}>• Datos de progreso: historial mensual, rachas y récords personales.</Text>
        <Text style={styles.bullet}>• Datos nutricionales: planes de dieta y revisiones con nutricionistas.</Text>

        <Text style={styles.section}>3. Uso de la información</Text>
        <Text style={styles.text}>
          Utilizamos tu información exclusivamente para:
        </Text>
        <Text style={styles.bullet}>• Brindarte una experiencia personalizada dentro de la app.</Text>
        <Text style={styles.bullet}>• Mostrarte tu progreso físico y de entrenamiento.</Text>
        <Text style={styles.bullet}>• Conectarte con planes y rutinas adecuadas a tu perfil.</Text>
        <Text style={styles.bullet}>• Mejorar nuestros servicios y funcionalidades.</Text>

        <Text style={styles.section}>4. Compartición de datos</Text>
        <Text style={styles.text}>
          LiftyHub no vende, alquila ni comparte tu información personal con
          terceros sin tu consentimiento expreso, salvo cuando sea requerido por
          autoridades competentes conforme a la legislación mexicana vigente.
        </Text>

        <Text style={styles.section}>5. Seguridad</Text>
        <Text style={styles.text}>
          Implementamos medidas de seguridad técnicas y administrativas para
          proteger tu información contra accesos no autorizados, pérdida o
          alteración. Tus contraseñas se almacenan cifradas y nunca en texto
          plano.
        </Text>

        <Text style={styles.section}>6. Tus derechos (ARCO)</Text>
        <Text style={styles.text}>
          Conforme a la LFPDPPP, tienes derecho a Acceder, Rectificar, Cancelar
          u Oponerte al tratamiento de tus datos personales. Para ejercer estos
          derechos puedes:
        </Text>
        <Text style={styles.bullet}>• Editar tu perfil directamente desde la app.</Text>
        <Text style={styles.bullet}>• Eliminar tu cuenta desde Configuración → Cuenta → Eliminar cuenta.</Text>
        <Text style={styles.bullet}>• Contactarnos en support@liftyhub.app</Text>

        <Text style={styles.section}>7. Retención de datos</Text>
        <Text style={styles.text}>
          Conservamos tu información mientras tu cuenta esté activa. Al eliminar
          tu cuenta, tus datos personales serán eliminados de nuestros servidores
          en un plazo máximo de 30 días naturales.
        </Text>

        <Text style={styles.section}>8. Cambios a esta política</Text>
        <Text style={styles.text}>
          Podemos actualizar esta política ocasionalmente. Te notificaremos
          dentro de la app ante cualquier cambio significativo. El uso continuado
          de LiftyHub después de dichos cambios implica tu aceptación.
        </Text>

        <Text style={styles.section}>9. Contacto</Text>
        <Text style={styles.text}>
          Si tienes dudas sobre esta política o el manejo de tus datos, contáctanos:
        </Text>
        <Text style={styles.bullet}>• Correo: support@liftyhub.app</Text>
        <Text style={styles.bullet}>• País: México</Text>

        <Text style={styles.footer}>© 2026 LiftyHub. Todos los derechos reservados.</Text>

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
    paddingTop: 120,
    paddingBottom: 40
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6
  },

  date: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 24
  },

  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8
  },

  text: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8
  },

  bullet: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
    paddingLeft: 8
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 32,
    marginBottom: 20,
    textAlign: "center"
  }

});
