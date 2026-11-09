import React from 'react';

export interface RadarDataPoint {
  label: string;
  value: number; // 0 to 100 (or max)
  rawCount?: number;
  subLabel?: string;
}

interface SpiderWebChartProps {
  data: RadarDataPoint[];
  title?: string;
  size?: number;
  color?: string; // e.g. emerald, blue
  benchmarkValue?: number; // optional target KPI line e.g. 80
}

export const SpiderWebChart: React.FC<SpiderWebChartProps> = ({
  data,
  title,
  size = 320,
  color = '#059669', // emerald-600
  benchmarkValue = 80,
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const numPoints = data.length;

  if (numPoints < 3) return null;

  const angleStep = (Math.PI * 2) / numPoints;
  const startAngle = -Math.PI / 2; // start from top

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (valueRatio: number, index: number) => {
    const angle = startAngle + index * angleStep;
    const r = radius * Math.max(0, Math.min(1, valueRatio));
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate data polygon points
  const points = data.map((d, i) => {
    const ratio = (d.value || 0) / 100;
    return getCoordinates(ratio, i);
  });
  const pointsString = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Generate benchmark polygon points
  const benchmarkPoints = data.map((_, i) => {
    const ratio = benchmarkValue / 100;
    return getCoordinates(ratio, i);
  });
  const benchmarkString = benchmarkPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center select-none">
      {title && <h4 className="text-xs font-bold text-slate-700 mb-2">{title}</h4>}
      <svg width={size} height={size} className="overflow-visible">
        {/* Background webs */}
        {levels.map((level, lvlIdx) => {
          const levelPoints = data
            .map((_, i) => {
              const { x, y } = getCoordinates(level, i);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={lvlIdx}
              points={levelPoints}
              fill={lvlIdx % 2 === 0 ? '#f8fafc' : '#f1f5f9'}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Axes lines */}
        {data.map((_, i) => {
          const outer = getCoordinates(1.0, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Benchmark line */}
        {benchmarkValue && (
          <polygon
            points={benchmarkString}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
        )}

        {/* Actual Data Polygon */}
        <polygon
          points={pointsString}
          fill={color}
          fillOpacity="0.25"
          stroke={color}
          strokeWidth="2.2"
        />

        {/* Data Vertices */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="#ffffff" strokeWidth="1.5" />
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-800"
            >
              {data[i].value}%
            </text>
          </g>
        ))}

        {/* Outer Axis Labels */}
        {data.map((d, i) => {
          const labelDist = 1.18;
          const { x, y } = getCoordinates(labelDist, i);
          return (
            <text
              key={i}
              x={x}
              y={y + 3}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-700"
            >
              {d.label}
              {d.rawCount !== undefined && (
                <tspan x={x} dy="12" className="text-[9px] font-normal fill-slate-500">
                  ({d.rawCount} murid)
                </tspan>
              )}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
          Pencapaian Semasa
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-0.5 bg-amber-500 border border-dashed border-amber-600"></span>
          Sasaran KPI (80%)
        </span>
      </div>
    </div>
  );
};
