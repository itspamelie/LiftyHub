interface Props {
  name: string;
  desc: string;
}

const PendingRequestCard: React.FC<Props> = ({ name, desc }) => {
  return (
    <div className="bg-[#191919] p-4 rounded-lg flex items-center justify-between">
      <div>
        <h4 className="text-white font-bold">{name}</h4>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>

      <div className="flex gap-2">
        <button className="text-green-400 hover:scale-110 transition">✔</button>
        <button className="text-red-400 hover:scale-110 transition">✖</button>
      </div>
    </div>
  );
};

export default PendingRequestCard;