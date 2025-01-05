import { Client } from "@notionhq/client";
import { useEffect, useState } from "react";

const useNotionData = (filterBy: string) => {
  const DATABASE_ID = "f96496173d2d4e8bacb65bfd77ab124e";
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const notion = new Client({ auth: process.env.EXPO_PUBLIC_NOTION_TOKEN });

  useEffect(() => {
    const controller = new AbortController();

    const filteredRows = async (filterBy: string) => {
      const query = {
        database_id: DATABASE_ID,
        filter: { property: "kms", select: { equals: filterBy } },
      };
      const records = [];
      let hasMore = true;

      while (hasMore) {
        const { results, has_more } = await notion.databases.query(query);
        records.push(...results);
        hasMore = has_more;
      }

      setData(records);
      setLoading(false);
    };

    filteredRows(filterBy);

    return () => controller.abort();
  }, []);

  return { data, loading };
};

export default useNotionData;
