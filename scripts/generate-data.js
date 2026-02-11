import fs from "fs";

const merchants = ["TechCorp", "Amazonia", "FinBank", "RetailHub"];
const categories = ["Food", "Travel", "Electronics", "Finance"];
const statuses = ["Completed", "Pending", "Failed"];

const data = [];

for (let i = 0; i < 1000000; i++) {
  data.push({
    id: i + 1,
    date: new Date(Date.now() - Math.random() * 1e12).toISOString(),
    merchant: merchants[i % 4],
    category: categories[i % 4],
    amount: +(Math.random() * 5000).toFixed(2),
    status: statuses[i % 3],
    description: `Transaction ${i + 1}`
  });
}

fs.writeFileSync("./public/transactions.json", JSON.stringify(data));

console.log("✅ Generated 1,000,000 rows");
