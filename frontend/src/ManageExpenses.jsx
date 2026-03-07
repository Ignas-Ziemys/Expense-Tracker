import { useEffect, useState } from "react";
import API from "./api";

export default function ManageExpenses() {
    const [expenses, setExpenses] = useState([]);

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

        API.delete(`/expenses/${id}`)
            .then(() => setExpenses(prev => prev.filter(e => e.id !== id)))
            .catch(err => console.error(err));
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h1>Manage Expenses</h1>
            {expenses.length === 0 && <p>No expenses yet.</p>}
            {expenses.map(exp => (
                <div key={exp.id} style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}>
                    {exp.title} | ${exp.amount} | {exp.category} | {exp.date}
                    <button style={{ marginLeft: "10px" }} onClick={() => deleteExpense(exp.id)}>❌ Remove</button>
                </div>
            ))}
        </div>
    );
}