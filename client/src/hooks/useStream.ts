import { useEffect, useState } from 'react';

interface useStreamProps {
  funcs: (() => void)[];
}

export const useStream = ({ funcs }: { funcs: (() => void)[] }) => {
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    if (!stream) return;

    funcs.forEach((func) => {
      func();
    });

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    }); // add the tracks so that it can be used by remote peer

    const videoElement = localVideoElement.current;
    if (videoElement) {
      videoElement.srcObject = localStream;
    }
  }, [localStream]);

  return [stream, setStream];
};
