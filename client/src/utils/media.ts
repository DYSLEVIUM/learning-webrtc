export const getLocalMediaStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
      // video: {
      //   width: 480,
      //   height: 270,
      //   frameRate: 28,
      // },
    });
    return stream;
  } catch (err) {
    console.error('Unable to get permission.');
    throw err;
  }
};
