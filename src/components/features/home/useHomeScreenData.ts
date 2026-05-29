import { useEffect, useState } from "react";
import { loadHomeScreenData, mockHomeScreenData } from "./home.data";
import type { HomeScreenData } from "./home.types";

interface UseHomeScreenDataResult {
  data: HomeScreenData;
  isLoading: boolean;
  error: string | null;
}

export function useHomeScreenData(): UseHomeScreenDataResult {
  const [data, setData] = useState<HomeScreenData>(mockHomeScreenData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function hydrateHomeData() {
      try {
        setIsLoading(true);
        const response = await loadHomeScreenData();
        if (!mounted) {
          return;
        }
        setData(response);
        setError(null);
      } catch {
        if (!mounted) {
          return;
        }
        setError("Unable to load home data. Using local fallback.");
        setData(mockHomeScreenData);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
