"use client";
// components/dashboard/CertificatesChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyStats {
  month: string;
  count: number;
}

interface CertificatesChartProps {
  data: MonthlyStats[];
}

export default function CertificatesChart({ data }: CertificatesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
