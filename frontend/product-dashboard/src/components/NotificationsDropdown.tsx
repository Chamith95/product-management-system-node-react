import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import type {LowStockEvent} from '@/common/api';
import {  connectEventStream } from '@/common/api'
import { Button } from '@/components/ui/button'

export function NotificationsDropdown() {
	const [open, setOpen] = useState(false)
	const [events, setEvents] = useState<Array<LowStockEvent>>([])
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		return connectEventStream((evt) => setEvents((e) => [evt, ...e].slice(0, 50)))
	}, [])

	useEffect(() => {
		function onDocClick(e: MouseEvent) {
			if (!ref.current) return
			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('click', onDocClick)
		return () => document.removeEventListener('click', onDocClick)
	}, [])

	return (
		<div className="relative" ref={ref}>
			<Button variant="ghost" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
				<Bell className="size-5" />
			</Button>
			{open && (
				<div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-md border bg-white shadow-lg dark:bg-neutral-900 dark:border-neutral-800">
				<div className="px-4 py-3 border-b font-semibold text-sm sticky top-0 bg-white dark:bg-neutral-900">
					Notifications
				</div>
				<div className="divide-y">
					{events.length === 0 ? (
						<div className="p-4 text-sm text-muted-foreground">No notifications yet</div>
					) : (
						events.map((e, i) => (
							<div key={i} className="p-4 text-sm hover:bg-muted/50">
								{e.message}
							</div>
						))
					)}
				</div>
			</div>
			)}
		</div>
	)
}


