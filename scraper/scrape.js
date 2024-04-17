import * as fs from "fs";

import axios from "axios";
import { JSDOM } from "jsdom";
import Queue from "async-parallel-queue";

// Test sites WITH results
// georgesriver.nsw.gov.au

// TODO:
// Remove #bangs on URLS

const WEBSITES = [
  "https://www.alpineshire.vic.gov.au/",
  "https://www.ararat.vic.gov.au",
  "https://www.ballarat.vic.gov.au/",
  "https://www.basscoast.vic.gov.au",
  "https://www.bawbawshire.vic.gov.au/Home",
  "https://www.bayside.vic.gov.au/",
  "https://www.benalla.vic.gov.au/Home",
  "https://www.boroondara.vic.gov.au/",
  "https://www.brimbank.vic.gov.au/",
  "https://www.buloke.vic.gov.au/",
  "https://www.campaspe.vic.gov.au/Home",
  "https://www.cardinia.vic.gov.au/",
  "https://www.casey.vic.gov.au/",
  "https://www.centralgoldfields.vic.gov.au/Home",
  "https://www.colacotway.vic.gov.au/Home",
  "https://www.corangamite.vic.gov.au/Home",
  "https://www.darebin.vic.gov.au/",
  "https://www.eastgippsland.vic.gov.au/",
  "https://www.frankston.vic.gov.au/Home",
  "https://www.gannawarra.vic.gov.au/Home",
  "https://www.gleneira.vic.gov.au/",
  "https://www.glenelg.vic.gov.au/Home",
  "https://www.goldenplains.vic.gov.au/",
  "https://www.bendigo.vic.gov.au/",
  "https://www.greaterdandenong.vic.gov.au/",
  "https://www.geelongaustralia.com.au/",
  "https://greatershepparton.com.au/",
  "https://www.hepburn.vic.gov.au/Home",
  "https://www.hobsonsbay.vic.gov.au/Home",
  "https://www.hrcc.vic.gov.au/Home",
  "https://www.hume.vic.gov.au/Home",
  "https://www.indigoshire.vic.gov.au/Home",
  "https://www.kingston.vic.gov.au/Home",
  "https://www.latrobe.vic.gov.au/",
  "https://www.loddon.vic.gov.au/Home",
  "https://www.mrsc.vic.gov.au/Home",
  "https://www.manningham.vic.gov.au",
  "https://www.mansfield.vic.gov.au/Home",
  "https://www.maribyrnong.vic.gov.au/Home",
  "https://www.maroondah.vic.gov.au/Home",
  "https://www.melbourne.vic.gov.au/Pages/home.aspx",
  "https://www.melton.vic.gov.au/Home",
  "https://www.merri-bek.vic.gov.au/",
  "https://www.mildura.vic.gov.au/Mildura-Rural-City-Council",
  "https://www.mitchellshire.vic.gov.au/",
  "https://www.moira.vic.gov.au/Home",
  "https://www.monash.vic.gov.au/Home",
  "https://mvcc.vic.gov.au/",
  "https://www.moorabool.vic.gov.au/Home",
  "https://www.mornpen.vic.gov.au/Home",
  "https://www.moyne.vic.gov.au/Home",
  "https://www.murrindindi.vic.gov.au/Home",
  "https://www.nillumbik.vic.gov.au/Home",
  "https://www.ngshire.vic.gov.au/Home",
  "https://www.portphillip.vic.gov.au/",
  "https://www.pyrenees.vic.gov.au/Home",
  "https://www.queenscliffe.vic.gov.au/Home",
  "https://www.southgippsland.vic.gov.au",
  "https://www.sthgrampians.vic.gov.au/page/HomePage.aspx",
  "https://www.stonnington.vic.gov.au/Home",
  "https://www.strathbogie.vic.gov.au/",
  "https://www.surfcoast.vic.gov.au/Home",
  "https://www.swanhill.vic.gov.au/",
  "https://www.towong.vic.gov.au/",
  "https://www.wangaratta.vic.gov.au/Home",
  "https://www.warrnambool.vic.gov.au/",
  "https://www.wellington.vic.gov.au/",
  "https://www.westwimmera.vic.gov.au/Home",
  "https://www.whittlesea.vic.gov.au/",
  "https://www.wodonga.vic.gov.au/",
  "https://www.wyndham.vic.gov.au/",
  "https://www.yarracity.vic.gov.au/",
  "https://www.yarraranges.vic.gov.au/Home",
  "https://www.yarriambiack.vic.gov.au/Home",
];

const WORDS = {
  positive: [
    "public art",
    "street art",
    "graffiti",
    "exterior",
    "commission",
    "mural",
    /expressions? of interest/g,
  ],
  negative: [
    "report graffiti",
    "illegal",
    "police",
    "sculpture",
    "closed",
    "anti-graffiti",
  ],
};

const publicArtWebsites = ["https://www.creativeballarat.com.au/"];

function scorePage(dom) {
  let score = 0;
  const foundNegatives = [];
  const foundPositives = [];

  dom.window.document
    .querySelectorAll('[role="navigation"], [class*="nav" i], nav')
    .forEach((el) => el.remove());

  let mainContent = dom.window.document.querySelector("body").innerHTML;

  // consider getting rid of role="navigation" elements first
  WORDS.positive.forEach((k) => {
    if (mainContent.match(k) !== null) {
      score++;
      foundPositives.push(k.toString());
    }
  });
  WORDS.negative.forEach((k) => {
    if (mainContent.match(k) !== null) {
      score--;
      foundNegatives.push(k.toString());
    }
  });

  return { score, matches: { foundNegatives, foundPositives } };
}

function isSameBaseUrl(url1, url2) {
  const getBaseUrl = (url) => {
    try {
      return new URL(url).origin;
    } catch (e) {
      return false;
    }
  };

  return getBaseUrl(url1) === getBaseUrl(url2);
}

function isRelativeUrl(url) {
  return url.startsWith("/");
}

function notProtocolUrl(url) {
  return !url.startsWith("//");
}

function notFileUrl(url) {
  const bannedExtensions = [
    ".pdf",
    ".rtf",
    ".txt",
    ".jpg",
    ".jpeg",
    ".docx",
    ".doc",
    ".png",
    ".mp3",
    ".mp4",
    ".mov",
  ];
  return !bannedExtensions.some((extension) =>
    url.toLowerCase().includes(extension)
  );
}

function notBannedUrlFragment(url) {
  const bannedUrlStrings = [
    "map",
    "book",
    "support-services",
    "archive",
    "pagination",
    "lang=",
    "cgi",
    "/Files/",
    "/files/",
    "_flysystem",
    "/downloads/",
    "umbraco",
  ];
  return !bannedUrlStrings.some((s) => url.toLowerCase().includes(s));
}

async function scrapeWebsite(targetUrl, baseUrl) {
  const pagesWithKeyword = [];
  const visitedUrls = new Set();
  const pageQueue = new Queue({ concurrency: 50 });

  const scrapeAndScore = async (url) => {
    try {
      const { data } = await axios.get(url, {
        maxContentLength: 2 * 1000 * 1000, // in bytes
        maxRedirects: 1,
        headers: {
          "User-Agent":
            "'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')",
        },
      });
      const dom = new JSDOM(data, {
        url: url,
      });

      const { score, matches } = scorePage(dom);

      if (score > 1) {
        console.log(`Match Found for: ${url}`);
      }

      const links = dom.window.document.querySelectorAll("a");

      return {
        match: score > 1,
        matches,
        links,
      };
    } catch (error) {
      console.log(`Error scraping ${url}: `, error.message);
      return;
    }
  };

  const scrapePage = async (url, baseUrl) => {
    if (visitedUrls.has(url)) return;
    visitedUrls.add(url);

    const res = await scrapeAndScore(url);

    if (!res) {
      return;
    }

    if (res.match) {
      pagesWithKeyword.push({ url, matches: res.matches });
    }

    if (res.links.length > 0) {
      res.links.forEach((link) => {
        let href = link.getAttribute("href");

        if (href === null) {
          return;
        }

        if (href.startsWith("/www.")) {
          href = href.replace("/www.", "www.");
        }

        if (href.contains("#")) {
          const bits = href.split("#");
          href = bits[0];
        }

        if (
          (isSameBaseUrl(href, baseUrl) || isRelativeUrl(href)) &&
          notProtocolUrl(href) &&
          notFileUrl(href) &&
          notBannedUrlFragment(href)
        ) {
          let absoluteUrl = href;

          if (isRelativeUrl(href)) {
            absoluteUrl = new URL(href, baseUrl).href;
          }

          if (!visitedUrls.has(absoluteUrl)) {
            pageQueue.add(scrapePage, { args: [absoluteUrl, baseUrl] });
          }
        }
      });
    }
  };

  pageQueue.add(scrapePage, { args: [targetUrl, baseUrl] });

  await pageQueue.waitIdle();

  //   console.log(pagesWithKeyword, Array.from(visitedUrls).length);
  return [pagesWithKeyword, Array.from(visitedUrls)];
}

// const openEoiTestCases = [
//   "https://www.nillumbik.vic.gov.au/Explore/Arts-and-culture/Opportunities-for-artists/Expression-of-interest-public-art-mural-project",
// ];

// const nowClosedEOITests = [
//     "'https://www.bawbawshire.vic.gov.au/Things-To-Do/Arts-and-Culture/Expressions-of-Interest-Noojee-Resilience-Art-Project'"
// ]

// console.time("scraping");
// const queue = new Queue({ concurrency: 20 });
// const data = await Promise.all(
//   WEBSITES.map((url) => queue.add(scrapeWebsite, { args: [url, url] }))
// );
// await queue.waitIdle();
// console.timeEnd("scraping");
// console.log(JSON.stringify(data, null, 2));

const fname = `data-${Date.now()}.json`;
fs.writeFile(fname, JSON.stringify({}, null, 2), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${fname} written!`);
  }
});
