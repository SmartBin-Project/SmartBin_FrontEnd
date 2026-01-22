// src/services/socket.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  socket: Socket | null = null;

  connect() {
    // Replace with your backend URL
    this.socket = io("http://localhost:3000", {
      transports: ["websocket"], // Forces WebSocket only (faster)
    });

    this.socket.on("connect", () => {
      console.log("✅ WebSocket Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Generic listener wrapper
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Stop listening to specific event
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();