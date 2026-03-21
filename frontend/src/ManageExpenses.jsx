import { useEffect, useState } from "react";
import API from "./api";
import CategoryOfThisMonthPieChart from "./CategoryOfThisMonthPieChart.jsx";

export default function ManageExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");


    useEffect(() => {
        API.get("/expenses")
            .then(res => {
                const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExpenses(sorted);
            })
            .catch(err => console.error(err));
    }, []);

    const deleteExpense = async(id) => {
        const confirmed = window.confirm("Delete this expense?");
        if (!confirmed) return;

        try {
            await API.delete(`/expenses/${id}`);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim() === "") {
            API.get("/expenses").then(res => {setExpenses(res.data)});
        }
        else
        {
            API.get(`/expenses/search?name=${value}`)
                .then(res => {setExpenses(res.data)})
            .catch(err => console.error(err));
        }
    }

    return (

        <div>
            <h1 style={{ color: "#378ADD" }}>Manage Expenses</h1>
            <h2 style={{ color: "#378ADD" }}>This month's expenses:</h2>
            <CategoryOfThisMonthPieChart />

            <input
                placeholder="Search for expense"
                value={search}
                onChange={handleSearch}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #378ADD", background: "#1e1e1e", color: "white", width: "100%", marginBottom: "12px" }}
            />

            {expenses.length === 0 && <p style={{ color: "#888" }}>No expenses yet.</p>}
            {expenses.map(exp => (
                <div key={exp.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                    backgroundColor: "#1e1e1e",
                    border: "1px solid #333"
                }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: "500", fontSize: "15px", color: "white" }}>{exp.title}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{exp.category} · {exp.date}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontWeight: "600", fontSize: "16px", color: "#e05a5a" }}>-€{exp.amount}</span>
                        <button onClick={() => deleteExpense(exp.id)} style={{
                            background: "none",
                            border: "1px solid #555",
                            borderRadius: "6px",
                            color: "#e05a5a",
                            cursor: "pointer",
                            padding: "4px 8px",
                            fontSize: "12px",
                        }}>Remove</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
