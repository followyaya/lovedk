import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { CurrencyProvider } from "./context/CurrencyContext";
import { ServicesProvider } from "./context/ServicesContext";
import Home from "./pages/Home";
import Checkout from "./components/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <CurrencyProvider>
        <ServicesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </ServicesProvider>
      </CurrencyProvider>
    </ClerkProvider>
  );
}

export default App;
