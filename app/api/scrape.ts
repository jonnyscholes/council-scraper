import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cheerio from "cheerio";

type Data = {
  pagesWithKeyword: string[];
};

async function scrapeWebsite(url: string, keyword: string): Promise<string[]> {
  const pagesWithKeyword: string[] = [];
  const visitedUrls: Set<string> = new Set();
  const urlsToVisit: string[] = [url];

  const isKeywordPresent = (data: string) =>
    data.toLowerCase().includes(keyword.toLowerCase());

  while (urlsToVisit.length > 0) {
    const currentUrl = urlsToVisit.pop()!;
    if (visitedUrls.has(currentUrl)) continue;
    visitedUrls.add(currentUrl);

    try {
      const { data } = await axios.get(currentUrl);
      const $ = cheerio.load(data);

      if (isKeywordPresent($("body").text())) {
        pagesWithKeyword.push(currentUrl);
      }

      $("a").each((_: any, element: any) => {
        const href = $(element).attr("href");
        if (href && href.startsWith("/") && !href.startsWith("//")) {
          const absoluteUrl = new URL(href, url).href;
          if (!visitedUrls.has(absoluteUrl)) {
            urlsToVisit.push(absoluteUrl);
          }
        }
      });
    } catch (error) {
      console.error(`Error scraping ${currentUrl}: `, error);
    }
  }

  return pagesWithKeyword;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url, keyword } = req.query;

  if (typeof url !== "string" || typeof keyword !== "string") {
    res.status(400).json({ pagesWithKeyword: [] });
    return;
  }

  const pagesWithKeyword = await scrapeWebsite(url, keyword);
  res.status(200).json({ pagesWithKeyword });
}
