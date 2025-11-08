import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    // Assume 'auth' is available in your router context and has isAuthenticated
    if (!context.userId) {
      throw redirect({
        to: '/sign-in',
        search: {
          // Save the current location to redirect back after a successful login
          redirect: location.href,
        },
      })
    }
  },
  // This component will only render if beforeLoad passes
  component: () => <Outlet />,
})