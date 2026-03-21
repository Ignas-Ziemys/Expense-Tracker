import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import API from "./api";

const COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD", "#BA7517", "#D4537E"];

export default function CategoryOfThisMonthPieChart() {
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        API.get("/expenses/by-month")
            .then((response) => {
                const grouped = response.data.reduce((acc, expense) => {
                    const category = expense.category;
                    acc[category] = (acc[category] || 0) + expense.amount;
                    return acc;
                }, {});

                const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
                setExpenses(chartData);
            })
            .catch((error) => {
                console.error("Error fetching expenses:", error);
            });
    }, [])
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={650} height={400}>
                <Pie
                    data={expenses}
                    dataKey="value"
                    nameKey="name"
                    cx={300}
                    cy={180}
                    outerRadius={150}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {expenses.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}