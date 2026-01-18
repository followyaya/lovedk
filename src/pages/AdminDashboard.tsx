import { useState, useEffect } from "react";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useServices } from "../context/ServicesContext";
import { useCurrency } from "../context/CurrencyContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Save, LogOut, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "followyaya@gmail.com";

export default function AdminDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { services, updateServicePrice, getIconComponent } = useServices();
  const { exchangeRates } = useCurrency();
  const navigate = useNavigate();
  const [editingPrices, setEditingPrices] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize editing state
  useEffect(() => {
    const initialPrices: { [key: string]: string } = {};
    services.forEach(s => {
      initialPrices[s.id] = s.priceEur.toString();
    });
    setEditingPrices(initialPrices);
  }, [services]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Strict email check for admin access
  const userEmail = user.primaryEmailAddress?.emailAddress;
  if (userEmail !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-white/70 mb-8">You do not have permission to view this page.</p>
        <Button onClick={() => navigate("/")} variant="outline" className="text-white border-white/20">
          Return Home
        </Button>
      </div>
    );
  }

  const handlePriceChange = (id: string, value: string) => {
    setEditingPrices(prev => ({ ...prev, [id]: value }));
    setHasChanges(true);
  };

  const handleSave = (id: string) => {
    const newPrice = parseFloat(editingPrices[id]);
    if (!isNaN(newPrice) && newPrice >= 0) {
      updateServicePrice(id, newPrice);
      // We don't set hasChanges to false here because other fields might still be edited
      // But for single row save, we can consider it saved. 
      // However, if we want "Update All", hasChanges should track overall state.
      // Let's keep it simple: Single save saves that one.
      alert(`Price for service updated to €${newPrice}`);
    } else {
      alert("Please enter a valid price");
    }
  };

  const handleSaveAll = () => {
    let updatedCount = 0;
    Object.entries(editingPrices).forEach(([id, price]) => {
      const newPrice = parseFloat(price);
      if (!isNaN(newPrice) && newPrice >= 0) {
        updateServicePrice(id, newPrice);
        updatedCount++;
      }
    });
    setHasChanges(false);
    alert(`Successfully updated ${updatedCount} service prices!`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-white/60">Manage service prices and settings</p>
          </div>
          <div className="flex gap-4">
            {hasChanges && (
              <Button 
                onClick={handleSaveAll}
                className="bg-green-600 hover:bg-green-700 text-white border-0 animate-pulse"
              >
                <Save className="mr-2 h-4 w-4" /> Update All Changes
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Site
            </Button>
          </div>
        </div>

        {/* Exchange Rates Overview */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-400" /> 
            Current Market Rates (Base: EUR)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <span className="text-white/50 text-sm">EUR (Base)</span>
              <p className="text-2xl font-bold text-white">€1.00</p>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <span className="text-white/50 text-sm">USD Rate</span>
              <p className="text-2xl font-bold text-green-400">${exchangeRates.USD?.toFixed(3)}</p>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <span className="text-white/50 text-sm">FCFA Rate</span>
              <p className="text-2xl font-bold text-yellow-400">{exchangeRates.XOF?.toFixed(0)} FCFA</p>
            </div>
          </div>
        </div>

        {/* Services Management */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Manage Services</h2>
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => {
              const Icon = getIconComponent(service.iconName);
              const currentPriceEur = parseFloat(editingPrices[service.id] || "0");
              const usdPrice = (currentPriceEur * (exchangeRates.USD || 1)).toFixed(2);
              const fcfaPrice = Math.ceil(currentPriceEur * (exchangeRates.XOF || 655)).toLocaleString();

              return (
                <div 
                  key={service.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-white/20 transition-all"
                >
                  <div className="p-4 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold">{service.title}</h3>
                    <p className="text-white/50 text-sm">{service.description}</p>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
                    <label className="text-xs text-white/50">Price (EUR)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">€</span>
                        <Input
                          type="number"
                          value={editingPrices[service.id] || ""}
                          onChange={(e) => handlePriceChange(service.id, e.target.value)}
                          className="pl-8 bg-black/40 border-white/10 focus:border-cyan-400"
                        />
                      </div>
                      <Button 
                        onClick={() => handleSave(service.id)}
                        size="icon"
                        className="bg-green-600 hover:bg-green-700 text-white border-0"
                        title="Save Price"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Auto-calculated previews */}
                  <div className="flex md:flex-col gap-4 md:gap-1 text-sm text-white/60 min-w-[120px] justify-center md:justify-end md:text-right">
                    <p title="Auto-calculated USD">≈ ${usdPrice}</p>
                    <p title="Auto-calculated FCFA">≈ {fcfaPrice} FCFA</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
