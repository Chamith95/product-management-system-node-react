import {  io } from 'socket.io-client'
import type {Socket} from 'socket.io-client';

export interface NotificationData {
  id: string
  type: 'low_stock_warning'
  title: string
  message: string
  productId: string
  productName: string
  sellerId: string
  currentQuantity: number
  threshold: number
  category: string
  timestamp: string
}

const WS_BASE = import.meta.env.VITE_NOTIFICATION_URL ?? 'http://localhost:3001'

export function connectNotifications(onNotification: (n: NotificationData) => void) {
  const sellerId = localStorage.getItem('seller_id') || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const socket: Socket = io(WS_BASE, { transports: ['websocket'] })

  const handleNotification = (n: NotificationData) => onNotification(n)

  socket.on('connect', () => {
    socket.emit('subscribe', sellerId)
  })
  socket.on('notification', handleNotification)

  return () => {
    socket.off('notification', handleNotification)
    socket.disconnect()
  }
}
