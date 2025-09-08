import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { connectNotifications, type NotificationData } from '@/common/ws'
import { NotificationCard } from './NotificationCard'

export function NotificationsPanel() {
  const [items, setItems] = useState<NotificationData[]>([])

  useEffect(() => {
    return connectNotifications((n) =>
      setItems((prev) => [n, ...prev].slice(0, 50))
    )
  }, [])

  return (
    <aside className="w-1/4 border-l bg-white dark:bg-neutral-900 dark:border-neutral-800 overflow-y-auto">
      <div className="px-4 py-3 border-b font-semibold text-sm sticky top-0 bg-white dark:bg-neutral-900 flex items-center justify-between">
        <span>Notifications</span>
        {items.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {items.length}
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Package className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Low stock alerts will appear here
            </p>
          </div>
        ) : (
          items.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </aside>
  )
}
