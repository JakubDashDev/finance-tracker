import { TransactionWithCategory } from "@/queries/user-transactions";
import React from "react";
import { DefaultTooltipContentProps, TooltipProps } from "recharts";

function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-500 rounded-lg p-5 flex flex-col items-center justify-center ">
        <p className="label">{`${label}`}</p>
        <div>
          {payload.map((item) => (
            <div key={item.name} style={{ display: "inline-block", padding: 10 }}>
              <div className={item.value > 0 ? "text-green-500" : "text-red-300"}>
                ${item.value > 0 ? `+${item.value}` : `${item.value}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default CustomTooltip;
