const clients = new Set();

export const sseBroker = {
  addClient(res) {
    clients.add(res);
  },

  removeClient(res) {
    clients.delete(res);
  },

  broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach((res) => {
      res.write(payload);
    });
  }
};
