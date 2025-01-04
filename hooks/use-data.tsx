import { useEffect, useState } from "react";

const BASE_API_URL = "https://jsonplaceholder.typicode.com/posts";

const useData = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const response = await fetch(`${BASE_API_URL}`);
      const data = await response.json();
      setData(data);
    };

    fetchData();

    return () => controller.abort();
  }, []);

  return { data };
};

export default useData;
