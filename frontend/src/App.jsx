import React, { useState } from "react";
import axios from "axios";
import ProductTable from "./ProductTable";

function App() {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await axios.get(`http://localhost:5000/api/search?keyword=${encodeURIComponent(keyword)}`);
    setProducts(res.data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Amazon FBA Product Dashboard</h1>
      <div className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1"
          placeholder="Search keyword..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <ProductTable products={products} />
    </div>
  );
}

export default App;
