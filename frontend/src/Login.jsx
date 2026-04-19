import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const endpoint = isRegister ? "/auth/register" : "/auth/login";
            const payload = isRegister
                ? { username, email, password }
                : { email, password };

            const response = await API.post(endpoint, payload);
            const token = response.data.token;

            if (!token) {
                alert("No token received");
                return;
            }

            localStorage.setItem("token", token);

            if (onLogin) {
                onLogin();
            }

            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Authentication failed");
        }
    };

    return (
        <div className="page-wrap">
            <section className="section-header">
                <h1 className="page-title">{isRegister ? "Register" : "Login"}</h1>
            </section>

            <section className="surface-card">
                <div className="form-grid">
                    {isRegister && (
                        <input
                            className="input-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}
                    <input
                        className="input-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="input-control"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="button-row">
                        <button className="btn-primary" onClick={handleSubmit}>
                            {isRegister ? "Create account" : "Login"}
                        </button>
                        <button className="btn-ghost" onClick={() => setIsRegister(!isRegister)}>
                            {isRegister ? "Have account? Login" : "No account? Register"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

