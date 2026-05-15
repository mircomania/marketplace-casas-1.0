import useSWR from 'swr';

type Property = {
  id: string;
  title: string;
  price: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProperties(ids?: string[]) {
  const query = ids && ids.length > 0 ? `/api/properties?ids=${ids.join(',')}` : null;

  const { data, error, isLoading } = useSWR<Property[]>(query, fetcher);

  return {
    properties: data || [],
    loading: isLoading,
    error,
  };
}
