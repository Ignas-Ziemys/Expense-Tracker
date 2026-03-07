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

        const numberAmount = parseFloat(amount);
        if (numberAmount < 0) {
            alert("Amount must be greater than 0");
            return;
        }

        const newExpense = { id: Date.now(), title, amount: Number(amount), category, date };

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

    const deleteExpense = (id) => {
        API.delete(`/expenses/${id}`)
            .then(() => setExpenses(prev => prev.filter(e => e.id !== id)))
            .catch(err => console.error(err));
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            <h1>Expense Tracker</h1>

            <h2>Recent Expenses:</h2>
            {expenses.map(exp => (
                <div key={exp.id} style={{ marginBottom: "10px" }}>
                    {exp.title} | ${exp.amount} | {exp.category} | {exp.date}
                </div>
            ))}

            <h3>Add Expense</h3>
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="FOOD">Food</option>
                <option value="TRAVEL">Travel</option>
                <option value="RENT">Rent</option>
                <option value="SHOPPING">Shopping</option>
                <option value="UTILITIES">Utilities</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="OTHER">Other</option>
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button onClick={addExpense}>Add Expense</button>
        </div>
    );
}