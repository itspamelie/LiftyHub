import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import MedicationIcon from "@mui/icons-material/Medication";
import type { SvgIconComponent } from "@mui/icons-material";

const features: { Icon: SvgIconComponent; title: string; desc: string }[] = [
  {
    Icon: FitnessCenterIcon,
    title: "Rutinas personalizadas",
    desc: "Crea tus propias rutinas con nombre, categoría, nivel y duración. Filtra por Fuerza, Cardio, HIIT, Movilidad o Full Body."
  },
  {
    Icon: DirectionsRunIcon,
    title: "Catálogo de ejercicios",
    desc: "Explora ejercicios con técnica detallada organizados por grupo muscular: pecho, espalda, pierna, abdomen y más."
  },
  {
    Icon: RestaurantIcon,
    title: "Plan de dieta",
    desc: "Recibe un plan alimenticio personalizado con desayuno, comida, cena y snacks asignado por tu nutricionista."
  },
  {
    Icon: BarChartIcon,
    title: "Estadísticas y progreso",
    desc: "Visualiza tu racha de entrenamiento, récords personales, actividad semanal y evolución mensual en un solo lugar."
  },
  {
    Icon: PersonIcon,
    title: "Perfil físico completo",
    desc: "Registra tu somatotipo, peso, altura, medidas corporales y objetivo para recibir recomendaciones más precisas."
  },
  {
    Icon: MedicationIcon,
    title: "Suplementación guiada",
    desc: "Consulta los suplementos recomendados por tu nutricionista con dosis, horario y propósito específico."
  }
];

export default function Features() {
  return (
    <section className="features-section py-5" id="funciones">

      <div className="container">

        <div className="row align-items-end mb-5">

          <div className="col-lg-7">

            <span className="section-badge mb-3 d-inline-block">
              TODO LO QUE NECESITAS
            </span>

            <h2 className="fw-bold display-6 text-light mt-2">
              Diseñada para atletas,<br/>
              construida para resultados.
            </h2>

          </div>

          <div className="col-lg-5">

            <p className="text-secondary fs-5">
              Todo lo que necesitas para alcanzar tu mejor
              versión, en una sola aplicación intuitiva.
            </p>

          </div>

        </div>

        <div className="row g-4">
          {features.map((f, i) => (
            <div className="col-md-4" key={i}>
              <div className="feature-card p-4 h-100">
                <div className="icon-box mb-4"><f.Icon sx={{ fontSize: 28, color: "#3B82F6" }} /></div>
                <h5 className="fw-bold text-light">{f.title}</h5>
                <p className="text-secondary">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}
