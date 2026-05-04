import { useQuery } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';

export const useImpactStats = (scope = "wanted") => {
  return useQuery({
    queryKey: ['impact-stats', scope],
    queryFn: () => wantedApi.getImpactStats(scope),
    staleTime: 30 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });
};
