import { useState } from "react";
import DebugPanel from "./DebugPanel";

const ROW_HEIGHT = 40;
const BUFFER = 5;

export default function VirtualGrid({ data, setData }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [pinnedColumns, setPinnedColumns] = useState([]);

  const containerHeight = 600;

  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);
  const endIndex = startIndex + visibleCount + BUFFER;

  const visibleRows = data.slice(startIndex, endIndex);
  const totalHeight = data.length * ROW_HEIGHT;

  const togglePin = (column) => {
    setPinnedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const handleRowClick = (event, rowId) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedRows((prev) =>
        prev.includes(rowId)
          ? prev.filter((id) => id !== rowId)
          : [...prev, rowId]
      );
    } else {
      setSelectedRows([rowId]);
    }
  };

  const handleEditSave = (rowId, field) => {
    const updated = data.map((row) =>
      row.id === rowId ? { ...row, [field]: editValue } : row
    );
    setData(updated);
    setEditingCell(null);
  };

  return (
    <>
      <div
        data-test-id="grid-scroll-container"
        className="grid-container"
        style={{ height: containerHeight }}
        onScroll={(e) => setScrollTop(e.target.scrollTop)}
      >
        {/* Header */}
        <div className="grid-header">
          <div
            data-test-id="header-id"
            className={`grid-cell ${
              pinnedColumns.includes("id") ? "pinned-column" : ""
            }`}
            style={{ width: 80 }}
          >
            ID
          </div>

          <div
            className={`grid-cell ${
              pinnedColumns.includes("date") ? "pinned-column" : ""
            }`}
            style={{ width: 200 }}
          >
            Date
          </div>

          <div className="grid-cell" style={{ width: 150 }}>
            Merchant
          </div>

          <div className="grid-cell" style={{ width: 100 }}>
            Amount
          </div>

          <div className="grid-cell" style={{ width: 100 }}>
            Status
          </div>

          <button
            data-test-id="pin-column-id"
            onClick={() => togglePin("id")}
            className="pin-button"
          >
            Toggle Pin ID
          </button>
        </div>

        {/* Sizer */}
        <div style={{ height: totalHeight }} />

        {/* Window */}
        <div
          data-test-id="grid-row-window"
          style={{
            position: "absolute",
            top: ROW_HEIGHT,
            left: 0,
            right: 0,
            transform: `translateY(${startIndex * ROW_HEIGHT}px)`
          }}
        >
          {visibleRows.map((row, index) => {
            const isSelected = selectedRows.includes(row.id);

            return (
              <div
                key={row.id}
                data-test-id={`virtual-row-${row.id}`}
                data-selected={isSelected ? "true" : undefined}
                className="grid-row"
                onClick={(e) => handleRowClick(e, row.id)}
              >
                {/* ID */}
                <div
                  className={`grid-cell ${
                    pinnedColumns.includes("id")
                      ? "pinned-column"
                      : ""
                  }`}
                  style={{ width: 80 }}
                >
                  {row.id}
                </div>

                {/* Date */}
                <div
                  className={`grid-cell ${
                    pinnedColumns.includes("date")
                      ? "pinned-column"
                      : ""
                  }`}
                  style={{ width: 200 }}
                >
                  {row.date}
                </div>

                {/* Merchant (Editable) */}
                <div
                  className="grid-cell"
                  style={{ width: 150 }}
                  data-test-id={`cell-${index}-merchant`}
                  onDoubleClick={() => {
                    setEditingCell(row.id);
                    setEditValue(row.merchant);
                  }}
                >
                  {editingCell === row.id ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) =>
                        setEditValue(e.target.value)
                      }
                      onBlur={() =>
                        handleEditSave(row.id, "merchant")
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditSave(row.id, "merchant");
                        }
                      }}
                      className="edit-input"
                    />
                  ) : (
                    row.merchant
                  )}
                </div>

                {/* Amount */}
                <div className="grid-cell" style={{ width: 100 }}>
                  {row.amount}
                </div>

                {/* Status */}
                <div className="grid-cell" style={{ width: 100 }}>
                  {row.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DebugPanel
        renderedRows={visibleRows.length}
        scrollIndex={startIndex}
        totalRows={data.length}
      />
    </>
  );
}
