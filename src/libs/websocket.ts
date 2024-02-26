export let ws: WebSocket | null = null;

export const wsConnect = () =>
  new Promise((resolve) => {
    if (process.env.WS) {
      ws = new WebSocket(process.env.WS);
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
    }
  });
