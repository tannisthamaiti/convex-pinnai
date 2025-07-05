import Plot from 'react-plotly.js';
import { useState } from 'react';
import depths from '../data/depths.json';   // pre-loaded array (10210 values)
import { useVugInfo } from '../hooks/useVugInfo';

export default function HeatmapPlot({ matrix }) {
  const [hoverDepth, setHoverDepth] = useState(null);
  const { data, isFetching } = useVugInfo(hoverDepth);

  const handleHover = e => {
    const rowIdx = e.points?.[0]?.y;          // y is row index
    if (typeof rowIdx === 'number') {
      setHoverDepth(depths[rowIdx]);
    }
  };

  return (
    <div className="flex gap-4">
      {/* heat-map */}
      <Plot
        data={[
          {
            z: matrix,
            type: 'heatmap',
            colorscale: 'Hot',
            hoverinfo: 'skip',
          },
        ]}
        layout={{
          yaxis: { autorange: 'reversed', title: 'Depth (m)' },
          margin: { t: 40 },
        }}
        onHover={handleHover}
        style={{ width: '700px', height: '700px' }}
      />

      {/* insight panel */}
      <aside className="w-80 p-4 rounded-xl border shadow h-fit sticky top-4">
        {hoverDepth === null ? (
          <p className="text-slate-500">Hover over the plot to see vug analysis…</p>
        ) : isFetching ? (
          <p className="animate-pulse">Analyzing depth {hoverDepth.toFixed(2)} m…</p>
        ) : (
          <>
            <h2 className="font-semibold mb-1">
              Depth&nbsp;{data.depth.toFixed(2)} m
            </h2>
            <p className="text-sm text-rose-600 mb-2">
              Vug % ≈ {data.vug_percent}%
            </p>
            <pre className="whitespace-pre-wrap text-xs">{data.message}</pre>
          </>
        )}
      </aside>
    </div>
  );
}
