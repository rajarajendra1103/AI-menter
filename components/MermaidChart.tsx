
import React, { useEffect, useRef } from 'react';

interface MermaidChartProps {
  chart: string;
  id: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      try {
        // @ts-ignore
        window.mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
        // @ts-ignore
        window.mermaid.render(`mermaid-${id}`, chart).then((res) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = res.svg;
          }
        });
      } catch (e) {
        console.error("Mermaid error:", e);
      }
    }
  }, [chart, id]);

  return (
    <div className="flex justify-center items-center w-full h-full p-4 overflow-auto bg-slate-900 rounded-lg shadow-inner">
      <div ref={containerRef} className="mermaid-container"></div>
    </div>
  );
};

export default MermaidChart;
