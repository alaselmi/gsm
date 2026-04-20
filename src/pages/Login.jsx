console.log("LOGIN RENDERED");
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth(); // يجب أن يعمل الآن

  return (
    <button onClick={() => login("test@test.com", "123")}>
      Login
    </button>
  );
}