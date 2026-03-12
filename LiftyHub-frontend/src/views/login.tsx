import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1f37] font-sans">
      <div className="bg-[#111827] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">LiftyHub</h2>
        <p className="text-[#a0aec0] text-center mb-8">Ingresa tus credenciales para continuar</p>
        
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a0aec0] mb-2">Usuario o Email</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-[#1a1f37] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#5eacff] transition-colors"
              placeholder="nombre@ejemplo.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#a0aec0] mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-[#1a1f37] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#5eacff] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-[#5eacff] hover:bg-[#4a90e2] text-white font-bold rounded-lg transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
          >
            INICIAR SESIÓN
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#a0aec0]">
            ¿No tienes cuenta? <span className="text-[#5eacff] cursor-pointer hover:underline">Regístrate</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;