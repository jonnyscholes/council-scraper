"use client"

import * as React from "react";

const WORDS = {
  positive: [
    "public art",
    "street art",
    "graffiti",
    "exterior",
    "commission",
    "mural",
    "EOI",
    /expressions? of interest/g,
    /calls? for artists?/g,
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

function siteResults(website, searchQuery, scoreFilter, selectedTags) {
    const scoreMatches = (m) => m.foundPositives.length - m.foundNegatives.length;

    let results = website.pagesWithKeyword.map((m) => {
      const score = scoreMatches(m.matches);
      return {
        url: m.url,
        score: score,
        matches: m.matches,
        title: m.title
      }
    }).sort((a, b) => b.score - a.score);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((r) => r.title.toLowerCase().includes(query) || r.url.toLowerCase().includes(query));
    }
    
    if (scoreFilter) {
      results = results.filter((r) => r.score >= scoreFilter);
    }

    if (selectedTags) {
      results = results.filter((m) => {
        const somePresent = selectedTags.some((t) => {
          return m.matches.foundPositives.includes(t);
        });

        return somePresent;
      });
    }

    return results.length === 0 ? false : results;
}

export default function Table({ websites }) {
  // {
  //   pagesWithKeyword: [ [Object], [Object], [Object], [Object] ],
  //   baseUrl: 'https://www.nillumbik.vic.gov.au/',
  //   state: 'VIC'
  //   title: 'Nillumbik Shire Council',
  // },

  let items = websites;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [scoreFilter, setScoreFilter] = React.useState(0);

  const tags = [...new Set(WORDS.positive.flat().map((w) => w.toString()))];

  const [selectedTags, setSelectedTags] = React.useState(tags);

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };



  const tagButtons = tags.map((tag, i) => (
    <button
      key={`tag-${i}`}
      className={selectedTags.includes(tag) ? "selected" : ""}
      onClick={(e) => {e.preventDefault(); handleTagClick(tag);}}
    >
      {tag}
    </button>
  ));

  const filteredSites = items.map((w, i) => {
    if (w.pagesWithKeyword.length === 0) return false;

    const filteredPages = siteResults(w, searchQuery, scoreFilter, selectedTags);
    if (!filteredPages) return false;

    return {
      ...w,
      filteredPages
    }
  }).filter((r) => r !== false);

  let siteDom = <p>Your filters do not match any results. Try something else and remember each filter is combined with the others.</p>;

  const totalResultCount = filteredSites.reduce((acc, site) => acc + site.filteredPages.length, 0);

  if (filteredSites.length !== 0) {
     siteDom = filteredSites.map((site, i) => {
    const fmtMatches = (words, bKey) => words.map((w,i)=>(<span className="tag" key={`${bKey}-${i}`}>{w},</span>))

    const rows = site.filteredPages.map((m, ii) => 
      (
        <tr key={`table-${i}-row-${ii}`}>
          <td>
            <p>{m.title}</p>
            <a className="resultLink" href={m.url} rel="noopener noreferrer" target="_blank">{m.url}</a>
          </td>
          <td>{m.score}</td>
          <td>{fmtMatches(m.matches.foundNegatives)}</td>
          <td>{fmtMatches(m.matches.foundPositives)}</td>
        </tr>
      )
    );

    const resultDom = rows.length !== 0 && (<section key={`s-${i}`}>
        <header>
          <h2>{site.state} - {site.baseUrl}</h2>
          <p>{rows.length} results found.</p>
        </header>
      
         <table key={`table-${i}`}>
          <tbody>
            <tr>
              <th>URL</th>
              <th>Score</th>
              <th>Negatives</th>
              <th>Positives</th>
            </tr>
            {rows}
          </tbody>
        </table>
      </section>)
    
    return resultDom
  });
  }

 

  return (
    <div>
      <form>
        <h2>Filters</h2>
        <div className="formItem">
          <label htmlFor="header-search">Search URL/Title:</label>
          <input
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
            type="text"
            id="header-search"
            placeholder="e.g expression"
            name="s"
          />
        </div>
        <div className="formItem">
          <label htmlFor="score-filter">Minimum Score:</label>
          <input
            type="number"
            id="score-filter"
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
          />
        </div>
        <div className="formItem formItem--Full">
          <label>Tags:</label>
          <div className="tagCloud">
            {tagButtons}
          </div>
        </div>
        
      </form>

      <h2>{totalResultCount} page{totalResultCount > 1 ? "s" : ''} found across {filteredSites.length} councils</h2>

      {siteDom}
    </div>
  );
}

