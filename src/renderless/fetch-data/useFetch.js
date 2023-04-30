import { useQuery } from "react-query";

function useFetch(key, query) {
  const { data, isLoading, isError } = useQuery(key, query, {
    suspense: true,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return data;
}
export default useFetch;
