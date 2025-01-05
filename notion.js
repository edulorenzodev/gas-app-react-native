import { Client } from "@notionhq/client";

const DATABASE_ID = "f96496173d2d4e8bacb65bfd77ab124e";

const notion = new Client({
  auth: process.env.EXPO_PUBLIC_NOTION_TOKEN,
});

export const getCarExpenses = async ({ filterBy } = {}) => {
  const query = { database_id: DATABASE_ID };
  const records = [];
  let hasMore = true;

  if (filterBy) {
    query.filter = {
      property: "Kms",
      number: {
        equals: filterBy,
      },
    };
  }

  console.log("query", query);

  while (hasMore) {
    const { results, has_more } = await notion.databases.query(query);

    records.push(...results);
    hasMore = has_more;
  }

  console.log("records", records.length);

  return records.map((page) => {
    const { properties } = page;
    const { date, kms } = properties;

    return {
      date: date.date.start,
      kms: kms.number,
    };
  });
};
