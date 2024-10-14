import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface GraphData {
  nodes: { id: number; label: string }[];
  links: { source: number; target: number }[];
}

interface GraphVisualizerProps {
  data: GraphData;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ data }) => {
  const graphRef = useRef<any>();

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={data}
      nodeLabel="label"
      nodeAutoColorBy="label"
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={0.005}
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const label = node.label;
        const fontSize = 12/globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y);
      }}
      nodePointerAreaPaint={(node: any, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = [node.label.length * 4, 10].map(n => n + 10);
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
      }}
    />
  );
};

export default GraphVisualizer;