import React, { useRef, useEffect, useState } from "react";
import {
  useLocalVideo,
  useLocalAudio,
  useLocalPeer,
} from "@huddle01/react/hooks";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic as MicIcon, MicOff as MicOffIcon } from "lucide-react";
import { Video as VideoIcon, VideoOff as VideoOffIcon } from "lucide-react";

const LocalPeerData: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    enableVideo,
    disableVideo,
    stream: videoStream,
    isVideoOn,
  } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { peerId, role, permissions, metadata, updateMetadata, updateRole } =
    useLocalPeer<{ displayName: string }>();
  const [metadataUpdated, setMetadataUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const handleVideo = () => {
    isVideoOn ? disableVideo() : enableVideo();
  };

  const handleAudio = () => {
    isAudioOn ? disableAudio() : enableAudio();
  };

  return (
    <div>
      <div className="border p-1 rounded-lg border-gray-300">
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
            Me: {metadata?.displayName}
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full mt-0.5 "
            onClick={handleVideo}
          >
            {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
          </Button>
          <Button
            variant="outline"
            className="mt-0.5 w-full ml-1"
            onClick={handleAudio}
          >
            {isAudioOn ? <MicIcon /> : <MicOffIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocalPeerData;
