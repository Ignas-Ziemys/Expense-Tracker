import { useEffect, useState } from "react";
import API from "./api";

export default function Home() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("FOOD");
    const [date, setDate] = useState("");
    const rescentCount = 5;

    useEffect(() => {
        API.get("/expenses")
            .then(res => {
                const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExpenses(sorted.slice(0, rescentCount));
            })
            .catch(err => console.error(err));
    }, []);

    const addExpense = () => {
        const amountRegex = /^\d+(\.\d{1,2})?$/;
        if (!amountRegex.test(amount)) {
            alert("Amount must be a number");
            return;
        }

        if (!date) {
            alert("Please select a date");
            return;
        }

        const numberAmount = parseFloat(amount);
        if (numberAmount < 0) {
            alert("Amount must be greater than 0");
            return;
        }

        const newExpense = { title, amount: Number(amount), category, date };

        API.post("/expenses", newExpense)
            .then(res => {
                setExpenses(prev => [res.data, ...prev].slice(0, rescentCount));
                setTitle("");
                setAmount("");
                setCategory("FOOD");
                setDate("");
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h1 style={{ color: "#378ADD" }}> Expense Tracker</h1>

            <h2 style={{ color: "#378ADD" }}> Recent Expenses</h2>
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
                    <span style={{ fontWeight: "600", fontSize: "16px", color: "#e05a5a" }}>-€{exp.amount}</span>
                </div>
            ))}

            <h3 style={{ marginTop: "24px" }}>Add Expense</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
                       style={{ padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#1e1e1e", color: "white" }} />
                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)}
                       style={{ padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#1e1e1e", color: "white" }} />
                <select value={category} onChange={e => setCategory(e.target.value)}
                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#1e1e1e", color: "white" }}>
                    <option value="FOOD">Food</option>
                    <option value="TRAVEL">Travel</option>
                    <option value="RENT">Rent</option>
                    <option value="SHOPPING">Shopping</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="OTHER">Other</option>
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#1e1e1e", color: "white", width: "100%" }}
                />

                <button onClick={addExpense} style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#378ADD",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "15px"
                }}>Add Expense</button>
            </div>
        </div>
    );
}