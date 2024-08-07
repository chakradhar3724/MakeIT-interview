export function initWebSocket(onMessage) {
    const ws = new WebSocket('ws://localhost:3000');
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };
  
    return ws;
  }
  