import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ManageExpenses from "./ManageExpenses";

function App() {
    return (
        <Router>
            <div style={{
                width: "100%",
                backgroundColor: "#378ADD",
                borderBottom: "1px solid #333",
                marginBottom: "24px",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "12px 20px",
                }}>
                    <Link to="/" style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid #444",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>Home</Link>
                    <Link to="/manage" style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid #444",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>Manage Expenses</Link>
                </div>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/manage" element={<ManageExpenses />} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;