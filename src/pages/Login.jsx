import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    login(email, password);

    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-3 p-6 bg-white shadow rounded">

        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 w-full">
          Login
        </button>

      </form>
    </div>
  );
}