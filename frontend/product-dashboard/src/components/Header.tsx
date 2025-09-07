import { Link } from '@tanstack/react-router'
import { NotificationsDropdown } from '@/components/NotificationsDropdown'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-neutral-900 text-white/90 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link to="/" className="font-semibold text-lg hover:text-white transition-colors">Products</Link>
        </nav>
        <div className="flex items-center gap-3">
          <NotificationsDropdown />
        </div>
      </div>
    </header>
  )
}
