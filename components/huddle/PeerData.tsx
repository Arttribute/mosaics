import React, { useRef, useEffect } from "react";
import {
  useRemotePeer,
  useRemoteVideo,
  useRemoteAudio,
} from "@huddle01/react/hooks";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface PeerDataProps {
  peerId: string;
}

const PeerData: React.FC<PeerDataProps> = ({ peerId }) => {
  const { metadata } = useRemotePeer<{ displayName: string }>({
    peerId,
  });
  const { stream: videoStream } = useRemoteVideo({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log(`PeerData: videoStream for peer ${peerId}:`, videoStream);
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    console.log(`PeerData: audioStream for peer ${peerId}:`, audioStream);
    if (audioStream && audioRef.current) {
      audioRef.current.srcObject = audioStream;
    }
  }, [audioStream]);

  useEffect(() => {
    console.log(`PeerData: metadata for peer ${peerId}:`, metadata);
  }, [metadata]);

  return (
    <div>
      <div className="border p-1 rounded-lg">
        <div className="rounded-lg">
          {videoStream ? (
            <video ref={videoRef} autoPlay playsInline className="rounded-lg" />
          ) : (
            <div className="bg-gray-200 w-full h-full rounded-lg p-[23px]">
              <div className="flex justify-center items-center h-full">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}
        </div>
        <div className="mt-1 border py-1 px-2 rounded-lg text-xs border-gray-400">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {metadata?.displayName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeerData;
