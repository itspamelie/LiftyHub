import React from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Dashboard from './views/dashboard'
import Login from './views/login'


function App() {
  return (
     <BrowserRouter>
      <Routes>

        {/* RUTAS PÚBLICAS 
        <Route path="/" element={<Home/>}/>
         */}
        <Route path="/login" element={<Login/>}/>


        {/* RUTAS DEL DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard/>}>
       {/* <Route index element={<Dashboard/>}/> */}
        </Route>

      </Routes>
    </BrowserRouter>

  );
}

export default App;