import { useEffect, useState } from "react";
import VirtualGrid from "./components/VirtualGrid";

function App() {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [amountAsc, setAmountAsc] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);

  // Load Data
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

  // Sort by Amount
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
    <div className="app-wrapper">
      <div className="app-container">
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
          style={{ marginBottom: "10px", padding: "6px" }}
        />

        {/* Filter Count */}
        <div
          data-test-id="filter-count"
          style={{ marginBottom: "15px" }}
        >
          Showing {filteredCount} of {originalData.length} rows
        </div>

        {/* Quick Filters */}
        <div style={{ marginBottom: "20px" }}>
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
    </div>
  );
}

export default App;
