import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Dashboard from './views/dashboard'
import Login from './views/login'
import Home from './views/home'
import MainDashboard from "./views/MainDashboard";
import UserDashboard from "./views/UserDashboard";
import SomatotypesDashboard from "./views/SomatotypesDashboard";
import RoutinesDashboard from "./views/RoutinesDashboard";
import PlansDashboard from "./views/PlansDashboard";
import NutritionistDashboard from "./views/NutritionistDashboard";
import ExercisesDashboard from "./views/ExercisesDashboard";


function App() {
  return (
     <BrowserRouter>
      <Routes>

        
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>


        {/* RUTAS DEL DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route index element={<MainDashboard/>}/>
          {/* RUTAS DEL DASHBOARD */}
  <Route index element={<MainDashboard/>} />
  <Route path="users" element={<UserDashboard/>} />
  <Route path="somatotypes" element={<SomatotypesDashboard/>} />
  <Route path="nutritionists" element={<NutritionistDashboard/>} />
  <Route path="plans" element={<PlansDashboard/>} />
  <Route path="routines" element={<RoutinesDashboard/>} />
  <Route path="exercises" element={<ExercisesDashboard/>} />
</Route>

      </Routes>
    </BrowserRouter>

  );
}

export default App;