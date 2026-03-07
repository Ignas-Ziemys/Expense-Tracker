import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ManageExpenses from "./ManageExpenses";

function App() {
    return (
        <Router>
            <nav style={{ marginBottom: "20px" }}>
                <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
                <Link to="/manage">Manage Expenses</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage" element={<ManageExpenses />} />
            </Routes>
        </Router>
    );
}
export default App;