// src/services/socket.ts
import { io, Socket } from 'socket.io-client'

class SocketService {
  socket: Socket | null = null

  connect() {
    this.socket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      console.log('WebSocket Connected:', this.socket?.id)
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket Disconnected')
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event)
    }
  }
}

export const socketService = new SocketService()
