const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    if (msg.type === 'user_response') {
      console.log('User response:', msg.content);
      ws.send(JSON.stringify({ type: 'listening', content: false }));
      // Process and respond to user input
    } else if (msg.type === 'code_submission') {
      console.log('Code submission:', msg.code);
      // Process and run code, then respond with result
      ws.send(JSON.stringify({ type: 'result', content: 'Code execution result here' }));
    }
  });

  ws.send(JSON.stringify({ type: 'question', content: { title: 'Sample Question', description: 'Explain your approach to solving this problem.' } }));
  ws.send(JSON.stringify({ type: 'listening', content: true }));
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
