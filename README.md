# 🚀 High-Performance Financial Data Grid (1 Million Rows)

## 📌 Overview

This project implements a **high-performance financial data grid** capable of rendering **1,000,000 rows** using manual virtual scrolling (windowing) without performance degradation.

The goal of this project is to demonstrate:

- Advanced DOM performance optimization
- Manual virtualization logic (no external libraries)
- Efficient state management for large datasets
- Enterprise-grade frontend architecture
- Docker containerization for consistent deployment

---

## 🏗️ Tech Stack

- React (Vite)
- Vanilla CSS
- Nginx (Production)
- Docker & Docker Compose

---

## ⚡ Core Features

### ✅ Manual Virtualization
- Only visible rows are rendered in DOM
- DOM node count remains < 100 at all times
- Uses:
  - Scroll container
  - Sizer element
  - transform: translateY() for GPU acceleration

---

### ✅ Debug Panel
Floating overlay displaying:
- FPS
- Rendered row count
- Current scroll index

Required data-test-ids implemented:
- debug-panel
- debug-fps
- debug-rendered-rows
- debug-scroll-position

---

### ✅ Sorting
- Clickable column header
- Sorts full 1M dataset
- Toggles ascending / descending
- data-test-id="header-amount"

---

### ✅ Filtering (Debounced)
- Filters full dataset by merchant
- Debounced (300ms)
- Case-insensitive matching
- data-test-id="filter-merchant"
- data-test-id="filter-count"

---

### ✅ Quick Status Filters
- Completed
- Pending
- Failed

Implemented with:
- data-test-id="quick-filter-Completed"
- data-test-id="quick-filter-Pending"

---

### ✅ Row Selection
- Single click selection
- Multi-select using Ctrl / Cmd
- Uses data-selected="true"

---

### ✅ Cell Editing
- Double-click merchant cell
- Inline input editor
- Save on Enter or blur
- data-test-id="cell-0-merchant"

---

### ✅ Column Pinning
- Sticky ID column
- Toggle button
- Adds pinned-column class
- data-test-id="pin-column-id"
- data-test-id="header-id"

---

## 🧠 Virtualization Approach

The virtualization logic works as follows:

1. A fixed-height scroll container (grid-scroll-container)
2. A sizer div with height = totalRows × rowHeight
3. A window container positioned absolutely
4. On scroll:
   - Calculate startIndex
   - Calculate endIndex
   - Slice visible rows
   - Translate window using:

     transform: translateY(startIndex * rowHeight)

This ensures:
- Constant DOM size
- Smooth 55–60 FPS scrolling
- No layout thrashing

---

## 📊 Performance

- DOM nodes < 100
- GPU-accelerated row positioning
- Debounced filtering
- Efficient in-memory operations
- Smooth scrolling on 1,000,000 rows

---

## 🧪 Data Generation

Generate 1 million rows:

npm install  
npm run generate-data  

This creates:

public/transactions.json  

Data Schema:

{
  "id": number,
  "date": "ISO string",
  "merchant": string,
  "category": string,
  "amount": number,
  "status": "Completed | Pending | Failed",
  "description": string
}

---

## 🖥️ Run Locally (Development)

npm install  
npm run generate-data  
npm run dev  

Open:

http://localhost:5173

---

## 🐳 Run with Docker (Production Mode)

Build and run:

docker compose up --build  

Open:

http://localhost:8080
 