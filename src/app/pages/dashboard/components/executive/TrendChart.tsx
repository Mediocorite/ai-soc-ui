import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface TrendChartProps {
  data: Record<string, unknown>[];
  type: "line" | "bar";
  dataKey: string;
  color: string;
  title: string;
  height?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  type,
  dataKey,
  color,
  title,
  height = 250,
}) => {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="flex-1" style={{ width: "100%", minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border/50"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-muted-foreground"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ r: 4, fill: color, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border/50"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-muted-foreground"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                {data.map((_entry: Record<string, unknown>, index: number) => (
                  <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
