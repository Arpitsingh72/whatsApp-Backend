// const express = require('express')
// const cors = require('cors');

// const authRoutes = require('./routes/authRoutes.js');


// const PORT =  8000

// const app = express()
// app.use(cors());

// app.use(express.json());

// app.use('/api', authRoutes)

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);

// })


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io for real-time messages
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
