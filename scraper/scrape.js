import * as fs from "fs";

import axios from "axios";
import * as jsdom from "jsdom";
const { JSDOM } = jsdom;
import Queue from "async-parallel-queue";

// Test sites WITH results
// georgesriver.nsw.gov.au

// const openEoiTestCases = [
//   "https://www.nillumbik.vic.gov.au/Explore/Arts-and-culture/Opportunities-for-artists/Expression-of-interest-public-art-mural-project",
// ];

// const nowClosedEOITests = [
//     "'https://www.bawbawshire.vic.gov.au/Things-To-Do/Arts-and-Culture/Expressions-of-Interest-Noojee-Resilience-Art-Project'"
// ]

const WebsitesThatBanUs = [
  "https://www.cardinia.vic.gov.au/", // Hard
  "https://www.basscoast.vic.gov.au", // Hard
];

const stylesheetIssues = ["https://www.swanhill.vic.gov.au/"];

const VIC_WEBSITES = [
  "https://www.boroondara.vic.gov.au/",
  "https://www.casey.vic.gov.au/",
  "https://www.goldenplains.vic.gov.au/",
  "https://www.bendigo.vic.gov.au/",
  "https://www.geelongaustralia.com.au/",
  "https://www.alpineshire.vic.gov.au/",
  "https://www.ararat.vic.gov.au",
  "https://www.ballarat.vic.gov.au/",
  "https://www.bawbawshire.vic.gov.au/Home",
  "https://www.bayside.vic.gov.au/",
  "https://www.benalla.vic.gov.au/Home",
  "https://www.brimbank.vic.gov.au/",
  "https://www.buloke.vic.gov.au/",
  "https://www.campaspe.vic.gov.au/Home",
  "https://www.centralgoldfields.vic.gov.au/Home",
  "https://www.colacotway.vic.gov.au/Home",
  "https://www.corangamite.vic.gov.au/Home",
  "https://www.darebin.vic.gov.au/",
  "https://www.eastgippsland.vic.gov.au/",
  "https://www.frankston.vic.gov.au/Home",
  "https://www.gannawarra.vic.gov.au/Home",
  "https://www.gleneira.vic.gov.au/",
  "https://www.glenelg.vic.gov.au/Home",
  "https://www.greaterdandenong.vic.gov.au/",
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

const NSW_WEBSITES = [
  "http://www.alburycity.nsw.gov.au/",
  "http://www.armidaleregional.nsw.gov.au/",
  "http://www.ballina.nsw.gov.au/",
  "http://www.balranald.nsw.gov.au/",
  "https://www.bathurst.nsw.gov.au/",
  "http://www.bayside.nsw.gov.au/",
  "http://www.begavalley.nsw.gov.au/",
  "http://www.bellingen.nsw.gov.au/",
  "http://www.berriganshire.nsw.gov.au/",
  "http://www.blacktown.nsw.gov.au/",
  "http://www.blandshire.nsw.gov.au/",
  "http://www.blayney.nsw.gov.au/",
  "http://www.bmcc.nsw.gov.au/",
  "http://www.bogan.nsw.gov.au/",
  "http://www.bourke.nsw.gov.au/",
  "http://www.brewarrina.nsw.gov.au/",
  "http://www.brokenhill.nsw.gov.au/",
  "http://www.burwood.nsw.gov.au/",
  "http://www.byron.nsw.gov.au/",
  "http://www.cabonne.nsw.gov.au/",
  "http://www.camden.nsw.gov.au/",
  "http://www.campbelltown.nsw.gov.au/",
  "http://www.carrathool.nsw.gov.au/",
  "https://www.centralcoast.nsw.gov.au/",
  "http://www.centraldarling.nsw.gov.au/",
  "http://www.cessnock.nsw.gov.au/",
  "http://www.canadabay.nsw.gov.au/",
  "https://www.cbcity.nsw.gov.au/",
  "http://www.parracity.nsw.gov.au/",
  "http://www.ryde.nsw.gov.au/",
  "http://www.cityofsydney.nsw.gov.au/",
  "http://www.clarence.nsw.gov.au/",
  "http://www.cobar.nsw.gov.au/",
  "https://www.coffsharbour.nsw.gov.au/Pages/default.aspx",
  "http://www.coolamon.nsw.gov.au/",
  "http://www.coonambleshire.nsw.gov.au/",
  "http://www.cgrc.nsw.gov.au/",
  "http://www.cowracouncil.com.au/",
  "http://www.cumberland.nsw.gov.au/",
  "https://www.dubbo.nsw.gov.au/",
  "http://www.dungog.nsw.gov.au/",
  "http://www.edwardriver.nsw.gov.au/",
  "https://www.esc.nsw.gov.au/",
  "http://www.fairfieldcity.nsw.gov.au/",
  "http://www.corowa.nsw.gov.au/",
  "http://www.forbes.nsw.gov.au/",
  "http://www.georgesriver.nsw.gov.au/Home",
  "http://www.gilgandra.nsw.gov.au/",
  "http://www.gisc.nsw.gov.au/",
  "https://www.goulburn.nsw.gov.au/Home",
  "http://www.greaterhume.nsw.gov.au/",
  "http://www.griffith.nsw.gov.au/",
  "http://www.gunnedah.nsw.gov.au/",
  "http://www.gwydirshire.com/",
  "https://www.hawkesbury.nsw.gov.au/",
  "http://www.hay.nsw.gov.au/",
  "http://hilltops.nsw.gov.au/",
  "http://www.hornsby.nsw.gov.au/",
  "http://www.huntershill.nsw.gov.au/",
  "https://www.innerwest.nsw.gov.au/",
  "http://www.inverell.nsw.gov.au/",
  "http://www.junee.nsw.gov.au/",
  "https://www.kempsey.nsw.gov.au/Home",
  "http://www.kiama.nsw.gov.au/",
  "http://www.kmc.nsw.gov.au/",
  "http://www.kyogle.nsw.gov.au/",
  "http://www.lachlan.nsw.gov.au/",
  "http://www.lakemac.com.au/",
  "http://www.lanecove.nsw.gov.au/",
  "http://www.leeton.nsw.gov.au/",
  "http://www.lismore.nsw.gov.au/",
  "http://www.lithgow.nsw.gov.au/",
  "https://www.liverpool.nsw.gov.au/",
  "https://www.liverpoolplains.nsw.gov.au/Home",
  "http://www.lockhart.nsw.gov.au/",
  "http://www.maitland.nsw.gov.au/",
  "http://www.midcoast.nsw.gov.au/Home",
  "https://www.midwestern.nsw.gov.au/Home",
  "https://www.mpsc.nsw.gov.au/",
  "http://www.mosman.nsw.gov.au/",
  "http://www.murrayriver.nsw.gov.au/",
  "http://www.murrumbidgee.nsw.gov.au/",
  "http://www.muswellbrook.nsw.gov.au/",
  "http://www.nambucca.nsw.gov.au/",
  "http://www.narrabri.nsw.gov.au/",
  "http://www.narrandera.nsw.gov.au/",
  "http://www.narromine.nsw.gov.au/",
  "http://www.ncc.nsw.gov.au/",
  "http://www.northsydney.nsw.gov.au/",
  "http://www.northernbeaches.nsw.gov.au/",
  "https://www.oberon.nsw.gov.au/",
  "http://www.orange.nsw.gov.au/",
  "http://www.parkes.nsw.gov.au/",
  "http://www.penrithcity.nsw.gov.au/",
  "http://www.pmhc.nsw.gov.au/",
  "http://www.portstephens.nsw.gov.au/",
  "http://www.qprc.nsw.gov.au/",
  "http://www.randwick.nsw.gov.au/",
  "http://www.richmondvalley.nsw.gov.au/",
  "http://www.shellharbour.nsw.gov.au/",
  "http://www.shoalhaven.nsw.gov.au/",
  "http://www.singleton.nsw.gov.au/",
  "https://www.snowymonaro.nsw.gov.au/",
  "http://www.snowyvalleys.nsw.gov.au/",
  "https://www.strathfield.nsw.gov.au/",
  "https://www.sutherlandshire.nsw.gov.au/",
  "http://www.tamworth.nsw.gov.au/",
  "http://www.temora.nsw.gov.au/",
  "http://www.tenterfield.nsw.gov.au/",
  "http://www.thehills.nsw.gov.au/Home",
  "http://www.tweed.nsw.gov.au/",
  "http://www.upperlachlan.nsw.gov.au/",
  "http://upperhunter.nsw.gov.au/",
  "http://www.uralla.nsw.gov.au/",
  "https://wagga.nsw.gov.au/",
  "http://www.walcha.nsw.gov.au/",
  "http://www.walgett.nsw.gov.au/",
  "http://www.warren.nsw.gov.au/",
  "http://www.warrumbungle.nsw.gov.au/",
  "http://www.waverley.nsw.gov.au/",
  "http://www.weddin.nsw.gov.au/",
  "http://www.wentworth.nsw.gov.au/",
  "http://www.willoughby.nsw.gov.au/",
  "http://www.wsc.nsw.gov.au/",
  "http://www.wollondilly.nsw.gov.au/",
  "http://www.wollongong.nsw.gov.au/",
  "http://www.woollahra.nsw.gov.au/",
  "http://www.yassvalley.nsw.gov.au/",
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
    .querySelectorAll('[role="navigation"], [class*="nav" i], nav, script')
    .forEach((el) => el.remove());

  let mainContent = dom.window.document
    .querySelector("body")
    .innerHTML.toLowerCase();

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
    "au/link/",
    "download?inline",
    "ePathway",
    "login",
    "events",
    "news",
  ];
  return !bannedUrlStrings.some((s) => url.toLowerCase().includes(s));
}

async function scrapeAndScore(url) {
  console.log(`Scraping ${url}`);
  try {
    const { data } = await axios.get(url, {
      maxContentLength: 2 * 1000 * 1000, // in bytes
      maxRedirects: 2,
      timeout: 10 * 1000, // miliseconds
    });

    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("error", () => {
      // No-op to skip console errors.
    });

    const dom = new JSDOM(data, {
      url,
      virtualConsole,
    });

    const { score, matches } = scorePage(dom);

    if (score > 1) {
      console.log(`Match Found for: ${url}`);
    }

    const links = dom.window.document.querySelectorAll("a");

    return {
      error: false,
      match: score > 1,
      matches,
      links,
    };
  } catch (error) {
    console.log(`Error scraping ${url}: `, error.message);
    let reason = "generic";

    if (error.message.indexOf("ETIMEDOUT") !== -1) {
      reason = "timeout";
    }

    return {
      error: true,
      reason,
    };
  }
}

async function scrapeWebsite(targetUrl, baseUrl, state) {
  const pagesWithKeyword = [];
  const visitedUrls = new Set();
  const pageQueue = new Queue({ concurrency: 20 });
  const maxTimeouts = 5;
  let numTimeouts = 0;

  const scrapePage = async (url, baseUrl) => {
    if (visitedUrls.has(url)) return;
    visitedUrls.add(url);

    const res = await scrapeAndScore(url);

    if (!res) {
      return;
    }

    if (res.error) {
      if (res.reason === "timeout") {
        numTimeouts++;
      }
      return;
    }

    if (res.match) {
      pagesWithKeyword.push({ url, matches: res.matches });
    }

    if (res.links.length > 0 && numTimeouts <= maxTimeouts) {
      res.links.forEach((link) => {
        let href = link.getAttribute("href");

        if (href === null) {
          return;
        }

        if (href.startsWith("/www.")) {
          href = href.replace("/www.", "www.");
        }

        if (href.indexOf("#") !== -1) {
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
    } else if (numTimeouts > maxTimeouts) {
      console.log(`Too many timeouts for ${url}. Abandoning.`);
    }
  };

  pageQueue.add(scrapePage, { args: [targetUrl, baseUrl] });

  await pageQueue.waitIdle();

  // console.log(pagesWithKeyword, Array.from(visitedUrls).length);
  // return { pagesWithKeyword, visitedUrls: Array.from(visitedUrls) };
  return { pagesWithKeyword, baseUrl, state };
}

const allLinks = [];
NSW_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "NSW" });
});
VIC_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "VIC" });
});

const smallTest = [
  { url: "https://www.nillumbik.vic.gov.au/", state: "VIC" },
  { url: "https://www.georgesriver.nsw.gov.au/", state: "NSW" },
];

console.time("scraping");
const queue = new Queue({ concurrency: 5 });
const data = await Promise.all(
  allLinks.map((council) =>
    queue.add(scrapeWebsite, {
      args: [council.url, council.url, council.state],
    })
  )
);

await queue.waitIdle();
console.timeEnd("scraping");

const fname = `data-${Date.now()}.json`;
fs.writeFile(fname, JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${fname} written!`);
  }
});
