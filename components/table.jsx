

export default async function Table({ websites }) {
  const siteDom = websites.map((w, i) => {

    if (w.rows.length === 0) return '';

    const fmtMatches = (words, bKey) => words.map((w,i)=>(<span className="tag" key={`${bKey}-${i}`}>{w},</span>))
    
    const rows = w.rows.map((m, ii) => 
      (
        <tr key={`table-${i}-row-${ii}`}>
          <td><a className="resultLink" href={m.url} rel="noopener noreferrer" target="_blank">{m.url}</a></td>
          <td>{fmtMatches(m.matches.foundNegatives)}</td>
          <td>{fmtMatches(m.matches.foundPositives)}</td>
        </tr>
      )
    );

    return (
      <section key={`s-${i}`}>
        <header>
          <h2>{w.base}</h2>
          <p>{w.rows.length} matches found.</p>
        </header>
      
        {w.rows.length !== 0 && (<table key={`table-${i}`}>
          <tbody>
            <tr>
              <th>URL</th>
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

