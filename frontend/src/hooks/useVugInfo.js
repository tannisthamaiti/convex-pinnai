import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const qc = new QueryClient();

export function VugProvider({ children }) {
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

export const useVugInfo = depth =>
  useQuery({
    queryKey: ['vug', depth],
    queryFn: async () => {
      const res = await fetch(`/vug-info?depth=${depth}`);
      if (!res.ok) throw new Error('API error');
      return res.json();
    },
    enabled: depth !== null,     // run only when we have a depth
    staleTime: 10 * 60 * 1000,   // 10 min cache
  });
