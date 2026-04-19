import { useEffect, useState } from "react";
import API from "./api";
import CategoryOfThisMonthPieChart from "./CategoryOfThisMonthPieChart.jsx";

const sortByDateDesc = (items) => [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

export default function ManageExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [newCategory, setNewCategory] = useState("FOOD");
    const [newDate, setNewDate] = useState("");
    const [totalSpent, setTotalSpent] = useState(0);
    const [averageSpent, setAverageSpent] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [mostExpensiveCategory, setMostExpensiveCategory] = useState("");
    const [isSorted, setIsSorted] = useState(false);
    const [budget, setBudget] = useState(0);
    const [isOverBudget, setIsOverBudget] = useState(false);

    const fetchAllExpenses = () => {
        API.get("/expenses")
            .then((res) => setExpenses(sortByDateDesc(res.data)))
            .catch((err) => console.error(err));
    };

    const fetchBudgetData = async () => {
        try {
            const response = await API.get("/budget/info");
            setBudget(response.data.limit);
            setIsOverBudget(response.data.isOver);
        } catch (error) {
            console.error("Error fetching budget:", error);
        }
    };

    useEffect(() => {
        API.get("/budget/info")
            .then((response) => {
                setBudget(response.data.limit);
                setIsOverBudget(response.data.isOver);
            })
            .catch((error) => console.error("Error fetching budget:", error));
    }, []);

    useEffect(() => {
        fetchAllExpenses();
    }, []);

    useEffect(() => {
        API.get("/expenses/spent-this-month")
            .then((res) => setTotalSpent(res.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        API.get("/expenses/most-expensive-category")
            .then((res) => setMostExpensiveCategory(res.data))
            .catch((err) => console.error(err))
    }, []);

    useEffect(() => {
        API.get("/expenses/avarage-per-day")
            .then((res) => setAverageSpent(res.data))
            .catch((err) => console.error(err));
    }, []);

    const deleteExpense = async (id) => {
        const confirmed = window.confirm("Delete this expense?");
        if (!confirmed) return;

        try {
            await API.delete(`/expenses/${id}`);
            setExpenses((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim() === "") {
            fetchAllExpenses();
            return;
        }

        API.get(`/expenses/search?name=${value}`)
            .then((res) => setExpenses(sortByDateDesc(res.data)))
            .catch((err) => console.error(err));
    };

    const handleFilter = () => {
        if (!startDate || !endDate) {
            alert("Please select both dates");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert("Invalid date format");
            return;
        }

        if (start > end) {
            alert("Start date must be before end date");
            return;
        }

        API.get("/expenses/filter", {
            params: {
                start: startDate,
                end: endDate,
            },
        })
            .then((res) => setExpenses(sortByDateDesc(res.data)))
            .catch((err) => console.error(err));
    };

    const handleSortByAmount = async () => {
        try {
            if (isSorted)
            {
                const response = await API.get("/expenses");
                setExpenses(response.data);
                setIsSorted(false);
            }
            else
            {
                const response = await API.get("/expenses/sort-by-ammount");
                setExpenses(response.data);
                setIsSorted(true);
            }
        }
        catch(error)
        {
            console.error("Error sorting", error)
        }
    };

    const clearFilter = () => {
        setStartDate("");
        setEndDate("");
        fetchAllExpenses();
    };

    const handleBudget = async () => {
        const newLimit = window.prompt("Enter your monthly budget limit:");
        if (newLimit)
        {
            await API.post(`/budget/${newLimit}`);
            fetchBudgetData();
        }
    };

    const updateExpense = async (id) => {
        try {
            const updatedExpense = {
                title: newTitle,
                amount: Number(newAmount),
                category: newCategory,
                date: newDate,
            };

            await API.put(`/expenses/${id}`, updatedExpense);
            setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e)));
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="page-wrap">
            <section className="section-header">
                <h1 className="page-title">Manage Expenses</h1>
            </section>

            <section className="surface-card">
                <div className="card-heading-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="section-title">This Month Overview</h2>
                    <button className="btn-ghost" onClick={handleBudget}> Set monthly budget </button>
                </div>
                <h2 className="section-title">Most expensive category this month: <span style={{ color: 'red' }}>{mostExpensiveCategory}</span></h2>
                <div className="chart-shell">
                    <CategoryOfThisMonthPieChart />
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <p className="stat-label">Total this month</p>
                        <p className="stat-value">{totalSpent}€</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Average per day</p>
                        <p className="stat-value">€ {averageSpent}</p>
                    </div>
                    <div>
                        <p className="stat-label">This month's budget</p>
                        <p className="stat-value">€ {budget}</p>
                        {isOverBudget && <p className="warning">⚠️ You are over budget!</p>}
                    </div>
                </div>
            </section>

            <section className="surface-card">
                <div className="card-heading-row">
                    <h2 className="section-title">Expense Records</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-ghost" onClick={handleSortByAmount}> {isSorted ? "Reset order" : "Sort by amount"} </button>
                    <button className="btn-ghost" onClick={() => setShowFilter(!showFilter)}>
                        {showFilter ? "Hide Filters" : "Filter by Date"}
                    </button>
                    </div>
                </div>

                <input
                    className="input-control"
                    placeholder="Search by title"
                    value={search}
                    onChange={handleSearch}
                />

                {showFilter && (
                    <div className="filter-panel">
                        <div className="date-row">
                            <input
                                className="input-control"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                className="input-control"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="button-row">
                            <button className="btn-primary" onClick={handleFilter}>Apply Filter</button>
                            <button className="btn-ghost" onClick={clearFilter}>Clear</button>
                        </div>
                    </div>
                )}

                {expenses.length === 0 && <p className="empty-note">No expenses yet.</p>}

                <div className="expense-list">
                    {expenses.map((exp) => (
                        <div key={exp.id} className="expense-item editable-item">
                            {editingId === exp.id ? (
                                <div className="edit-grid">
                                    <input className="input-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                    <input
                                        className="input-control"
                                        type="number"
                                        value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                    />
                                    <select
                                        className="input-control"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    >
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
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                    />
                                    <div className="button-row">
                                        <button className="btn-primary" onClick={() => updateExpense(exp.id)}>Save</button>
                                        <button className="btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p className="expense-title">{exp.title}</p>
                                        <p className="expense-meta">{exp.category} · {exp.date}</p>
                                    </div>
                                    <div className="expense-actions">
                                        <span className="expense-amount">{exp.amount}€</span>
                                        <button
                                            className="btn-ghost"
                                            onClick={() => {
                                                setEditingId(exp.id);
                                                setNewTitle(exp.title);
                                                setNewAmount(exp.amount);
                                                setNewCategory(exp.category);
                                                setNewDate(exp.date);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button className="btn-danger" onClick={() => deleteExpense(exp.id)}>Remove</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
