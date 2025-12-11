import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import ReportPage from '@/pages/ReportPage';
import ExplorerPage from '@/pages/ExplorerPage';
import StudioPage from '@/pages/StudioPage';
import PlaygroundPage from '@/pages/PlaygroundPage';
import ResourcesPage from '@/pages/ResourcesPage';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/report",
    element: <ReportPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/explorer",
    element: <ExplorerPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/studio",
    element: <StudioPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/playground",
    element: <PlaygroundPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/resources",
    element: <ResourcesPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)