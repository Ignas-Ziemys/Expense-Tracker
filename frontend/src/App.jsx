import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import ManageExpenses from "./ManageExpenses";

function App() {
    return (
        <Router>
            <div className="app-shell">
                <header className="top-nav">
                    <div className="nav-inner">
                        <div className="brand-mark">Expense Tracker</div>
                        <nav className="nav-links">
                            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                Home
                            </NavLink>
                            <NavLink to="/manage" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                Manage Expenses
                            </NavLink>
                        </nav>
                    </div>
                </header>

                <main className="content-shell">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/manage" element={<ManageExpenses />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;