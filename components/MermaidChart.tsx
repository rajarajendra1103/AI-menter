
import React, { useEffect, useRef } from 'react';

interface MermaidChartProps {
  chart: string;
  id: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import mermaid to ensure it works with SSR frameworks if needed,
    // and to group initialization logic.
    const renderChart = async () => {
      if (containerRef.current && chart) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
          
          const { svg } = await mermaid.render(`mermaid-${id}`, chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (e) {
          console.error("Mermaid error:", e);
          if (containerRef.current) {
             containerRef.current.innerHTML = `<p class="text-red-500 text-sm">Failed to render chart</p>`;
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
