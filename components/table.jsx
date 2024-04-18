

export default async function Table({ websites }) {

  // {
  //   pagesWithKeyword: [ [Object], [Object], [Object], [Object] ],
  //   baseUrl: 'https://www.nillumbik.vic.gov.au/',
  //   state: 'VIC'
  // },

  const siteDom = websites.map((w, i) => {

    if (w.pagesWithKeyword.length === 0) return '';

    const fmtMatches = (words, bKey) => words.map((w,i)=>(<span className="tag" key={`${bKey}-${i}`}>{w},</span>))
    const scoreMatches = (m) => m.foundPositives.length - m.foundNegatives.length;

    const results = w.pagesWithKeyword.map((m, ii) => {
      const score = scoreMatches(m.matches);
      return {
        url: m.url,
        score: score,
        matches: m.matches
      }
    }).sort((a, b) => b.score - a.score);
    
    const rows = results.map((m, ii) => 
      (
        <tr key={`table-${i}-row-${ii}`}>
          <td><a className="resultLink" href={m.url} rel="noopener noreferrer" target="_blank">{m.url}</a></td>
          <td>{m.score}</td>
          <td>{fmtMatches(m.matches.foundNegatives)}</td>
          <td>{fmtMatches(m.matches.foundPositives)}</td>
        </tr>
      )
    );

    return (
      <section key={`s-${i}`}>
        <header>
          <h2>{w.state} - {w.baseUrl}</h2>
          <p>{w.pagesWithKeyword.length} matches found.</p>
        </header>
      
        {w.pagesWithKeyword.length !== 0 && (<table key={`table-${i}`}>
          <tbody>
            <tr>
              <th>URL</th>
              <th>Score</th>
              <th>Negatives</th>
              <th>Positives</th>
              
            </tr>
            {rows}
          </tbody>
        </table>)}
      </section>
    )
  });

  return (
    <div>
      {siteDom}
    </div>
  );
}

