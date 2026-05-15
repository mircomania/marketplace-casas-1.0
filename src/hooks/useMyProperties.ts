import useSWR from 'swr';

type MyProperty = {
  id: string;
  title: string;
  price: number;
  status: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMyProperties() {
  const { data, error, isLoading } = useSWR<MyProperty[]>('/api/my-properties', fetcher);

  return {
    properties: data || [],

    loading: isLoading,

    error,
  };
}
