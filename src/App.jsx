import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  console.log("APP LOADED");

  ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

