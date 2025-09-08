import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import { Toaster } from '../components/ui/sonner'
import { NotificationsPanel } from '../components/NotificationsPanel'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <main className="w-3/4 px-4 py-6 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
        <NotificationsPanel />
      </div>
      <Toaster />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
})
