import React, { useState } from "react";
import ChartBSR from "./ChartBSR";

function calcProfit(price, cost, shipping, fbaFee) {
  const profit = price - cost - shipping - fbaFee;
  const roi = ((profit) / (cost + shipping)) * 100;
  return { profit, roi };
}

const ProductTable = ({ products }) => {
  const [inputs, setInputs] = useState({});

  const handleInput = (asin, field, value) => {
    setInputs({
      ...inputs,
      [asin]: { ...inputs[asin], [field]: parseFloat(value) || 0 }
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-xs">
        <thead>
          <tr>
            <th className="border px-2">ASIN</th>
            <th className="border px-2">Title</th>
            <th className="border px-2">Price</th>
            <th className="border px-2">Reviews</th>
            <th className="border px-2">BSR</th>
            <th className="border px-2">Rating</th>
            <th className="border px-2">Cost</th>
            <th className="border px-2">Shipping</th>
            <th className="border px-2">FBA Fee</th>
            <th className="border px-2">Profit</th>
            <th className="border px-2">ROI %</th>
            <th className="border px-2">Charts</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => {
            const { asin, title, price, reviews, bsr, rating, keepa, winner } = prod;
            const userInput = inputs[asin] || { cost: 5, shipping: 2, fbaFee: 4 };
            const { profit, roi } = calcProfit(price, userInput.cost, userInput.shipping, userInput.fbaFee);
            return (
              <tr key={asin} className={winner ? "bg-green-100" : ""}>
                <td className="border px-2">{asin}</td>
                <td className="border px-2 max-w-xs truncate">{title}</td>
                <td className="border px-2">${price}</td>
                <td className="border px-2">{reviews}</td>
                <td className="border px-2">{bsr}</td>
                <td className="border px-2">{rating}</td>
                <td className="border px-2">
                  <input type="number" className="w-16 border" value={userInput.cost}
                    onChange={e => handleInput(asin, "cost", e.target.value)} />
                </td>
                <td className="border px-2">
                  <input type="number" className="w-16 border" value={userInput.shipping}
                    onChange={e => handleInput(asin, "shipping", e.target.value)} />
                </td>
                <td className="border px-2">
                  <input type="number" className="w-16 border" value={userInput.fbaFee}
                    onChange={e => handleInput(asin, "fbaFee", e.target.value)} />
                </td>
                <td className={`border px-2 ${profit > 0 ? "text-green-600" : "text-red-600"}`}>${profit.toFixed(2)}</td>
                <td className="border px-2">{roi.toFixed(1)}%</td>
                <td className="border px-2">
                  <ChartBSR priceHistory={keepa.priceHistory} bsrHistory={keepa.bsrHistory} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
