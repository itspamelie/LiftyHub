const AppointmentsTable: React.FC = () => {
  return (
    <div className="bg-[#191919] rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-gray-400 text-xs border-b border-white/5">
          <tr>
            <th className="p-4">Hora</th>
            <th className="p-4">Paciente</th>
            <th className="p-4">Tipo</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t border-white/5 hover:bg-white/5">
            <td className="p-4 text-cyan-400">09:30</td>
            <td className="p-4 text-white">Beatriz</td>
            <td className="p-4">Control</td>
          </tr>

          <tr className="border-t border-white/5 hover:bg-white/5">
            <td className="p-4 text-cyan-400">11:00</td>
            <td className="p-4 text-white">Marco</td>
            <td className="p-4">Primera consulta</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;