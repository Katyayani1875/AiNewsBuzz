let ioInstance = null;

const setIoInstance = (io) => {
  ioInstance = io;
};

const getIoInstance = () => {
  if (!ioInstance) throw new Error("Socket.IO not initialized!");
  return ioInstance;
};

module.exports = { setIoInstance, getIoInstance };
