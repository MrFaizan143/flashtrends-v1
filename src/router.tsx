import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Subtle cross-fade between routes using the View Transitions API,
    // with an instant-swap fallback on unsupported browsers.
    defaultViewTransition: true,
  });

  return router;
};

