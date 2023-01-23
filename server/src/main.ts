import { Server } from 'socket.io';

const PORT = parseInt(process.env.PORT || '3000', 10);
const io = new Server({
  cors: {
    origin: '*',
  },
});

const emailToSocketMap = new Map();
const socketToEmailMap = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', ({ email, roomId }) => {
    emailToSocketMap.set(email, socket.id);
    socketToEmailMap.set(socket.id, email);

    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-joined', { email });
    socket.emit('joined-room', { roomId });
  });

  socket.on('call-user', ({ email, offer }) => {
    const sender = socketToEmailMap.get(socket.id);
    const receiver = emailToSocketMap.get(email);

    socket.to(receiver).emit('incoming-call', { caller: sender, offer });
  });

  socket.on('call-accepted', ({ caller, answer }) => {
    const callerSocketId = emailToSocketMap.get(caller);
    socket.to(callerSocketId).emit('call-accepted', { answer });
  });

  socket.on('candidate', ({ candidate }) => {
    socket.broadcast.emit('candidate', { candidate });
  });

  socket.on('disconnect', () => {
    console.log(`${socketToEmailMap.get(socket.id)} has disconnected!`);
  });
});

io.listen(PORT);
