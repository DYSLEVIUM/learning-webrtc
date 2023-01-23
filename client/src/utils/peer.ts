export const setLocalDescription = async (
  peerConnection: RTCPeerConnection,
  sdp: RTCSessionDescriptionInit
) => {
  try {
    if (!peerConnection.localDescription)
      await peerConnection.setLocalDescription(sdp);
  } catch (err) {
    console.error('Unable to set local decsription!');
    throw err;
  }
};

export const setRemoteDescription = async (
  peerConnection: RTCPeerConnection,
  sdp: RTCSessionDescriptionInit
) => {
  try {
    if (!peerConnection.remoteDescription)
      await peerConnection.setRemoteDescription(sdp);
  } catch (err) {
    console.error('Unable to set remote decsription!');
    throw err;
  }
};

const sdpOptions = { offerToReceiveAudio: true, offerToReceiveVideo: true };

export const createOffer = async (peerConnection: RTCPeerConnection) => {
  try {
    const offer = await peerConnection.createOffer(sdpOptions);
    await setLocalDescription(peerConnection, offer);
    return offer;
  } catch (err) {
    console.error('Unable to create offer!');
    throw err;
  }
};

export const createAnswer = async (peerConnection: RTCPeerConnection) => {
  try {
    const answer = await peerConnection.createAnswer(sdpOptions);
    await setLocalDescription(peerConnection, answer);
    return answer;
  } catch (err) {
    console.error('Unable to create answer!');
    throw err;
  }
};

export const addICECandidate = async (
  peerConnection: RTCPeerConnection,
  candidate: RTCIceCandidateInit
) => {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (err) {
    console.error('Unable to add Ice candidate!');
    throw err;
  }
};
