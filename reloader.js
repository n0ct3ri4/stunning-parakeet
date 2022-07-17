const ws = new WebSocket("ws://localhost:3001");
ws.onopen = () => {
  ws.onmessage = (msg) => {
    if (msg.data == "changes") {
      location.reload();
    }
  };
};
