import React, { useState } from "react";

interface InvitePlayersProps {
  ensNames: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

const InvitePlayers: React.FC<InvitePlayersProps> = ({
  ensNames,
  setPlayers,
}) => {
  const [selectedEnsName, setSelectedEnsName] = useState("");

  const handleAddPlayer = () => {
    if (selectedEnsName) {
      setPlayers((prevPlayers) => [...prevPlayers, selectedEnsName]);
      setSelectedEnsName("");
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Invite Players
      </h3>
      <select
        value={selectedEnsName}
        onChange={(e) => setSelectedEnsName(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          Select ENS Name
        </option>
        {ensNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddPlayer}
        className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Add Player
      </button>
    </div>
  );
};

export default InvitePlayers;
