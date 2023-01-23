import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from '../hooks/useSocket';

type roomJoinType = { roomId: string };

const Home = () => {
  const socket = useSocket() as NonNullable<ReturnType<typeof useSocket>>;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleJoin = useCallback(() => {
    socket.emit('join-room', { email, roomId });
  }, [socket, email, roomId]);

  const handleRoomJoined = useCallback(({ roomId }: roomJoinType) => {
    navigate(`/room/${roomId}`);
  }, []);

  useEffect(() => {
    socket.on('joined-room', handleRoomJoined);

    return () => {
      socket.off('joined-room', handleRoomJoined);
    };
  }, [socket]);

  return (
    <div>
      <label htmlFor='email'>Email</label>
      <input
        type='email'
        placeholder='Enter your email'
        name='email'
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor='roomCode'>Room Code</label>
      <input
        type='text'
        placeholder='Enter Room Code'
        name='roomCode'
        id='roomCode'
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input type='button' value='Join Room' onClick={handleJoin} />
    </div>
  );
};

export default Home;
