export let ws: WebSocket | null = null;

export const wsConnect = () =>
  new Promise((resolve, reject) => {
    ws = new WebSocket('ws://localhost:8000');
    ws.onerror = (event) => {
      console.log(event);
    };

    ws.onmessage = (event) => {
      console.log('ws received', event.data);
    };
    ws.onopen = () => {
      ws && ws.send('Hello Server!');
      resolve(true);
    };
  });
