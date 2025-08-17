"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

function TanstackQueryProvider({ children }: PropsWithChildren) {
  const handleUnauthorize = (error: Error) => {
    // displayTxError(error); // todo
    if (![401].includes((error?.cause as Response)?.status)) {
      return;
    }
    // return logout();
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 min: Data is fresh for a short time
            gcTime: 30 * 60 * 1000, // 30 min: Keep in cache to avoid frequent re-fetching
            refetchInterval: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
        },
        queryCache: new QueryCache({ onError: handleUnauthorize }),
        mutationCache: new MutationCache({ onError: handleUnauthorize }),
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
export default TanstackQueryProvider;
