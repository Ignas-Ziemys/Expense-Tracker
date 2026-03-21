import { useEffect, useState } from "react";
import API from "./api";
import CategoryOfThisMonthPieChart from "./CategoryOfThisMonthPieChart.jsx";

export default function ManageExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newCategory, setNewCategory] = useState("FOOD");
    const [newDate, setNewDate] = useState("");


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

    const updateExpense = async (id) => {
        try {
            const updatedExpense = {
                title: newTitle,
                amount: Number(newAmount),
                category: newCategory,
                date: newDate
            };
            console.log("Sending:", updatedExpense); // add this
            await API.put(`/expenses/${id}`, updatedExpense);
            setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedExpense } : e));
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

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
                    padding: "12px 16px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                    backgroundColor: "#1e1e1e",
                    border: "1px solid #333"
                }}>
                    {editingId === exp.id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                   style={{ padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#2a2a2a", color: "white" }} />
                            <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)}
                                   style={{ padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#2a2a2a", color: "white" }} />
                            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#2a2a2a", color: "white" }}>
                                <option value="FOOD">Food</option>
                                <option value="TRAVEL">Travel</option>
                                <option value="RENT">Rent</option>
                                <option value="SHOPPING">Shopping</option>
                                <option value="UTILITIES">Utilities</option>
                                <option value="ENTERTAINMENT">Entertainment</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                                   style={{ padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#2a2a2a", color: "white" }} />
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => updateExpense(exp.id)} style={{
                                    padding: "6px 12px", borderRadius: "6px", border: "none",
                                    backgroundColor: "#7F77DD", color: "white", cursor: "pointer"
                                }}>Save</button>
                                <button onClick={() => setEditingId(null)} style={{
                                    padding: "6px 12px", borderRadius: "6px", border: "1px solid #555",
                                    background: "none", color: "white", cursor: "pointer"
                                }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: "500", fontSize: "15px", color: "white" }}>{exp.title}</p>
                                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{exp.category} · {exp.date}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontWeight: "600", fontSize: "16px", color: "#e05a5a" }}>-€{exp.amount}</span>
                                <button onClick={() => {
                                    setEditingId(exp.id);
                                    setNewTitle(exp.title);
                                    setNewAmount(exp.amount);
                                    setNewCategory(exp.category);
                                    setNewDate(exp.date);
                                }} style={{
                                    background: "none", border: "1px solid #555", borderRadius: "6px",
                                    color: "white", cursor: "pointer", padding: "4px 8px", fontSize: "12px"
                                }}>Edit</button>
                                <button onClick={() => deleteExpense(exp.id)} style={{
                                    background: "none", border: "1px solid #555", borderRadius: "6px",
                                    color: "#e05a5a", cursor: "pointer", padding: "4px 8px", fontSize: "12px"
                                }}>Remove</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
