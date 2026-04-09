import { useEffect, useState } from "react";
import API from "./api";

const RECENT_COUNT = 5;

const sortByDateDesc = (items) => [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Home() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("FOOD");
    const [date, setDate] = useState("");

    useEffect(() => {
        API.get("/expenses")
            .then((res) => {
                setExpenses(sortByDateDesc(res.data).slice(0, RECENT_COUNT));
            })
            .catch((err) => console.error(err));
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
            .then((res) => {
                setExpenses((prev) => [res.data, ...prev].slice(0, RECENT_COUNT));
                setTitle("");
                setAmount("");
                setCategory("FOOD");
                setDate("");
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="page-wrap">
            <section className="section-header">
                <h1 className="page-title">Expense Tracker</h1>
            </section>

            <section className="surface-card">
                <div className="card-heading-row">
                    <h2 className="section-title">Recent Expenses</h2>
                    <span className="tag-pill">Last {RECENT_COUNT}</span>
                </div>

                {expenses.length === 0 && <p className="empty-note">No expenses yet.</p>}

                <div className="expense-list">
                    {expenses.map((exp) => (
                        <div key={exp.id} className="expense-item">
                            <div>
                                <p className="expense-title">{exp.title}</p>
                                <p className="expense-meta">{exp.category} · {exp.date}</p>
                            </div>
                            <span className="expense-amount">{exp.amount}€</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="surface-card">
                <h3 className="section-title">Add Expense</h3>

                <div className="form-grid">
                    <input
                        className="input-control"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="input-control"
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <select className="input-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="FOOD">Food</option>
                        <option value="TRAVEL">Travel</option>
                        <option value="RENT">Rent</option>
                        <option value="SHOPPING">Shopping</option>
                        <option value="UTILITIES">Utilities</option>
                        <option value="ENTERTAINMENT">Entertainment</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <input
                        className="input-control"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <button className="btn-primary" onClick={addExpense}>Add Expense</button>
                </div>
            </section>
        </div>
    );
}