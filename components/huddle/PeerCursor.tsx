import React, { useEffect } from "react";
import { useRemotePeer } from "@huddle01/react/hooks";

import { Hand as HandIcon } from "lucide-react";

interface PeerCursorProps {
  peerId: string;
}

const PeerCursor: React.FC<PeerCursorProps> = ({ peerId }) => {
  const { metadata } = useRemotePeer<{ displayName: string }>({
    peerId,
  });

  useEffect(() => {
    console.log(`PeerCursor: metadata for peer ${peerId}:`, metadata);
  }, [metadata]);

  return (
    <div className="flex">
      <HandIcon className="h-4 w-4 mt-1 mr-0.5 text-purple-500" />
      <div className="bg-white  mt-1 border border-purple-400 py-0.5 px-2 rounded-xl b">
        <p className="text-xs font-semibold  bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {metadata?.displayName}
        </p>
      </div>
    </div>
  );
};

export default PeerCursor;
