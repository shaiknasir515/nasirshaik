import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function ChartBox({ data }) {
  return (
    <div className="chartWrap">
      <h3 style={{marginTop:0}}>Price Chart</h3>
      <div style={{width:"100%", height:340}}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={20} />
            <YAxis domain={["auto","auto"]} />
            <Tooltip />
            <Line dataKey="price" type="monotone" stroke="#2563eb" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
