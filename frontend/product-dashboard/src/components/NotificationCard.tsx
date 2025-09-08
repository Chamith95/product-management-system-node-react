import { AlertTriangle, Package, TrendingDown } from 'lucide-react'
import type { NotificationData } from '@/common/ws'

interface NotificationCardProps {
  notification: NotificationData
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const getSeverityColor = (currentQuantity: number, threshold: number) => {
    const ratio = currentQuantity / threshold
    if (ratio <= 0.5) return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
    if (ratio <= 0.75) return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950'
    return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
  }

  const getSeverityIcon = (currentQuantity: number, threshold: number) => {
    const ratio = currentQuantity / threshold
    if (ratio <= 0.5) return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
    if (ratio <= 0.75) return <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    return <Package className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${getSeverityColor(notification.currentQuantity, notification.threshold)}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getSeverityIcon(notification.currentQuantity, notification.threshold)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {notification.message}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Product:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate ml-2">
                {notification.productName}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Category:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {notification.category}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Stock:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {notification.currentQuantity}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {notification.threshold}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
