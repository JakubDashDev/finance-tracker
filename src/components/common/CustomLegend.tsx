import React from "react";

interface CustomLegendProps {
  color: string;
  title: string;
  value?: number;
}

function CustomLegend({ color, title, value }: CustomLegendProps) {
  return (
    <div className="flex flex-col  text-sm">
      <div className="flex items-center gap-1">
        <div className={`w-[6px] h-[6px] rounded-full ${color}`} style={{ backgroundColor: color }} />
        <span className="capitalize">{title}</span>
      </div>

      <span className="font-semibold">$ {value && `${value.toFixed(2)}`}</span>
    </div>
  );
}

export default CustomLegend;
