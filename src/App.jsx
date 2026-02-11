import { useEffect, useState } from "react";
import VirtualGrid from "./components/VirtualGrid";

function App() {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [amountAsc, setAmountAsc] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);

  // Load data
  useEffect(() => {
    fetch("/transactions.json")
      .then((res) => res.json())
      .then((json) => {
        setOriginalData(json);
        setData(json);
        setFilteredCount(json.length);
      })
      .catch((err) => console.error(err));
  }, []);

  // Sort by amount
  const sortByAmount = () => {
    const sorted = [...data].sort((a, b) =>
      amountAsc ? a.amount - b.amount : b.amount - a.amount
    );
    setData(sorted);
    setAmountAsc(!amountAsc);
  };

  // Debounced Merchant Filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!filterValue) {
        setData(originalData);
        setFilteredCount(originalData.length);
      } else {
        const filtered = originalData.filter((row) =>
          row.merchant
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
        setData(filtered);
        setFilteredCount(filtered.length);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filterValue, originalData]);

  // Quick Status Filter
  const quickFilterStatus = (status) => {
    const filtered = originalData.filter(
      (row) => row.status === status
    );
    setData(filtered);
    setFilteredCount(filtered.length);
    setFilterValue("");
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        background: "#f5f5f5",
        minHeight: "100vh",
        color: "#000"
      }}
    >
      <h2>Million Row Financial Grid</h2>

      {/* Sort */}
      <div
        data-test-id="header-amount"
        onClick={sortByAmount}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "10px"
        }}
      >
        Click to Sort by Amount
      </div>

      {/* Merchant Filter */}
      <input
        data-test-id="filter-merchant"
        type="text"
        placeholder="Filter by merchant..."
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />

      {/* Filter Count */}
      <div data-test-id="filter-count" style={{ marginBottom: "10px" }}>
        Showing {filteredCount} of {originalData.length} rows
      </div>

      {/* Quick Filters */}
      <div style={{ marginBottom: "15px" }}>
        <button
          data-test-id="quick-filter-Completed"
          onClick={() => quickFilterStatus("Completed")}
          style={{ marginRight: "10px" }}
        >
          Show Completed
        </button>

        <button
          data-test-id="quick-filter-Pending"
          onClick={() => quickFilterStatus("Pending")}
          style={{ marginRight: "10px" }}
        >
          Show Pending
        </button>

        <button
          data-test-id="quick-filter-Failed"
          onClick={() => quickFilterStatus("Failed")}
        >
          Show Failed
        </button>
      </div>

      {data.length > 0 ? (
        <VirtualGrid data={data} setData={setData} />
      ) : (
        <p>No matching rows</p>
      )}
    </div>
  );
}

export default App;
