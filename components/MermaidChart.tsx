
import React, { useEffect, useRef } from 'react';

interface MermaidChartProps {
  chart: string;
  id: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current && chart) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

          // Clean the chart string: remove markdown code blocks like ```mermaid ... ```
          const cleanChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();

          const uniqueId = `mermaid-${id}-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, cleanChart);

          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (e) {
          console.error("Mermaid error:", e);
          if (containerRef.current) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            containerRef.current.innerHTML = `
               <div class="p-4 text-red-400 bg-red-900/20 rounded border border-red-500/50 text-sm overflow-auto">
                 <p class="font-bold mb-2">Failed to render flowchart</p>
                 <p class="font-mono text-xs mb-2">${errorMessage}</p>
                 <details>
                   <summary class="cursor-pointer text-xs opacity-70 hover:opacity-100">View Raw Source</summary>
                   <pre class="mt-2 text-[10px] bg-black/50 p-2 rounded">${chart}</pre>
                 </details>
               </div>
             `;
          }
        }
      }
    };

    renderChart();
  }, [chart, id]);

  return (
    <div className="flex justify-center items-center w-full h-full p-4 overflow-auto bg-slate-900 rounded-lg shadow-inner">
      <div ref={containerRef} className="mermaid-container w-full h-full flex items-center justify-center"></div>
    </div>
  );
};

export default MermaidChart;
