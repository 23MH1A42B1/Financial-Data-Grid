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

  // Sort
  const sortByAmount = () => {
    const sorted = [...data].sort((a, b) =>
      amountAsc ? a.amount - b.amount : b.amount - a.amount
    );
    setData(sorted);
    setAmountAsc(!amountAsc);
  };

  // Debounced Filter
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

        <div className="toolbar">

          <div
            data-test-id="header-amount"
            className="sort-button"
            onClick={sortByAmount}
          >
            Click to Sort by Amount
          </div>

          <input
            data-test-id="filter-merchant"
            type="text"
            placeholder="Filter by merchant..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />

          <div
            data-test-id="filter-count"
            className="filter-count"
          >
            Showing {filteredCount} of {originalData.length} rows
          </div>

          <div className="quick-filters">
            <button
              data-test-id="quick-filter-Completed"
              onClick={() => quickFilterStatus("Completed")}
            >
              Show Completed
            </button>

            <button
              data-test-id="quick-filter-Pending"
              onClick={() => quickFilterStatus("Pending")}
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
