import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Home from "./Home";
import ManageExpenses from "./ManageExpenses";
import Login from "./Login";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

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
                            {!isAuthenticated && (
                                <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                    Login
                                </NavLink>
                            )}
                            {isAuthenticated && (
                                <button className="btn-ghost" onClick={handleLogout}>Logout</button>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="content-shell">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated
                                    ? <Home />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/manage"
                            element={
                                isAuthenticated
                                    ? <ManageExpenses />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                isAuthenticated
                                    ? <Navigate to="/" replace />
                                    : <Login onLogin={() => setIsAuthenticated(true)} />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;