import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API from "./api";

const COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD", "#BA7517", "#D4537E"];

export default function CategoryOfThisMonthPieChart() {
    const [expenses, setExpenses] = useState([]);
    const total = expenses.reduce((sum, item) => sum + item.value, 0);

    const toPercent = (value) => {
        if (!total) return 0;
        return Math.round((value / total) * 100);
    };

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
    }, []);

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={expenses}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="46%"
                        outerRadius="62%"
                        label={false}
                    >
                        {expenses.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name) => {
                            const numericValue = Number(value);
                            const percent = toPercent(numericValue);
                            return [`${numericValue}€ (${percent}%)`, name];
                        }}
                        contentStyle={{
                            background: "#0f1424",
                            border: "1px solid #2f3a56",
                            borderRadius: "10px",
                            color: "#f5f7ff",
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={42}
                        iconType="circle"
                        formatter={(value, entry) => `${value} (${toPercent(entry.payload.value)}%)`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}