import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { LoadingPage } from './components/LoadingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

const SCREEN_ORDER = [
  '/calendar',
  '/tules',
  '/exams',
  '/theory',
  '/account',
] as const;

function screenIndexForPathname(pathname: string): number {
  return SCREEN_ORDER.findIndex(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isMainTabRootPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/') return true;
  const roots: readonly string[] = [
    '/calendar',
    '/tules',
    '/exams',
    '/theory',
    '/account',
  ];
  return roots.includes(p);
}

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPendingComponent: LoadingPage,
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      if (!fromLocation) return [];

      const fromScreen = screenIndexForPathname(fromLocation.pathname);
      const toScreen = screenIndexForPathname(toLocation.pathname);

      const bothAtTabRoots =
        isMainTabRootPath(fromLocation.pathname) &&
        isMainTabRootPath(toLocation.pathname);

      if (
        bothAtTabRoots &&
        fromScreen !== -1 &&
        toScreen !== -1 &&
        fromScreen !== toScreen
      ) {
        return fromScreen < toScreen ? ['tab-next'] : ['tab-prev'];
      }

      const fromIndex = fromLocation.state.__TSR_index;
      const toIndex = toLocation.state.__TSR_index;

      if (fromIndex === toIndex) return [];
      return fromIndex > toIndex ? ['slide-right'] : ['slide-left'];
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const handleLogout = async () => {
    localStorage.removeItem('isLogged');
    await router.invalidate();
    router.navigate({ to: '/login' });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col">
        <AuthProvider onLogout={handleLogout}>
          <ProgressProvider>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <RouterProvider router={router} />
            </div>
          </ProgressProvider>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
