import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { usePeer } from '../hooks/usePeer';
import { useSocket } from '../hooks/useSocket';
import { getLocalMediaStream } from '../utils/media';
import { createAnswer, createOffer, setRemoteDescription } from '../utils/peer';

type newUserJoinedType = { email: string };
type incomingCallType = { caller: string; offer: RTCSessionDescriptionInit };
type callAcceptedType = { answer: RTCSessionDescriptionInit };
type candidateType = { candidate: RTCIceCandidate };

const Room = () => {
  const socket = useSocket() as NonNullable<ReturnType<typeof useSocket>>;
  const peerConnection = usePeer() as NonNullable<RTCPeerConnection>;

  const localVideoElement = useRef<HTMLVideoElement>(null);
  const remoteVideoElement = useRef<HTMLVideoElement>(null);

  //! extract to custom strem hook
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const handleNewUserJoined = useCallback(
    async ({ email }: newUserJoinedType) => {
      try {
        const offer = await createOffer(peerConnection);
        socket.emit('call-user', { email, offer });
        // console.log('called user', email);
      } catch (err) {
        console.error('Could not make offer!');
        console.error(err);
      }
    },
    []
  );

  const handleIncomingCall = useCallback(
    async ({ caller, offer }: incomingCallType) => {
      try {
        await setRemoteDescription(peerConnection, offer); // saving the offer
        const answer = await createAnswer(peerConnection);
        socket.emit('call-accepted', { caller, answer });
        // console.log('received call from', caller);
      } catch (err) {
        console.error('Could not accept call!');
        console.error(err);
      }
    },
    []
  );

  const handleCallAccepted = useCallback(
    async ({ answer }: callAcceptedType) => {
      await setRemoteDescription(peerConnection, answer);
      // console.log('call accepted');
    },
    []
  );

  const handleIceCandidate = useCallback(({ candidate }: candidateType) => {
    peerConnection.addIceCandidate(candidate);
    // console.log('got ice candidate');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stream = await getLocalMediaStream();
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        }); // add the tracks so that it can be used by remote peer

        setLocalStream(stream);
      } catch (err) {
        console.error('Could not set Media Stream!');
      }

      peerConnection.ontrack = (ev) => {
        const stream = new MediaStream();
        ev.streams[0].getTracks().forEach((track) => {
          stream.addTrack(track);
        });
        setRemoteStream(stream);
        // console.log('setting remote stream');
      };

      peerConnection.onicecandidate = (ev) => {
        const candidate = ev.candidate;
        if (candidate) {
          socket.emit('candidate', { candidate });
        }
      };

      // putting inside async function, as we don't want to register the event listener before the peerConnection handlers are set, (we could have also added peerconnection as a dependency to the useCallback and kept all of these event registration outside)
      socket.on('user-joined', handleNewUserJoined);
      socket.on('incoming-call', handleIncomingCall);
      socket.on('call-accepted', handleCallAccepted);
      socket.on('candidate', handleIceCandidate);
    })();

    return () => {
      socket.off('user-joined', handleNewUserJoined);
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('candidate', handleIceCandidate);
    };
  }, []);

  useEffect(() => {
    if (!localStream) return;

    const videoElement = localVideoElement.current;
    if (videoElement) {
      videoElement.srcObject = localStream;
    }

    return () => {
      if (localStream) {
        console.log('stopping local stream');

        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [localStream]);

  useEffect(() => {
    if (!remoteStream) return;

    const videoElement = remoteVideoElement.current;
    if (videoElement) {
      videoElement.srcObject = remoteStream;
    }

    return () => {
      if (remoteStream) {
        console.log('stopping remote stream');
        remoteStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [remoteStream]);

  return (
    <>
      <Link to={'/'}>Home</Link>
      <div>
        <video
          ref={localVideoElement}
          muted={true}
          autoPlay={true}
          playsInline={true}
          style={{ backgroundColor: '#000', transform: 'scaleX(-1)' }}
        >
          Sorry, video not supported.
        </video>

        {remoteStream ? (
          <video
            ref={remoteVideoElement}
            muted={true}
            autoPlay={true}
            playsInline={true}
            style={{ backgroundColor: '#000', transform: 'scaleX(-1)' }}
          />
        ) : (
          <div style={{ backgroundColor: 'black' }}>Remote user left</div>
        )}
      </div>
    </>
  );
};

export default Room;
