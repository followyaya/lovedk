import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, Package, Clock, CheckCircle, Smartphone, Globe, Database, Cloud, Loader2 } from "lucide-react";
import { useServices } from "../context/ServicesContext";
import { useCurrency } from "../context/CurrencyContext";

interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  iconName?: string;
  price: number;
  currency: string;
  date: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  userEmail: string;
}

export default function ClientDashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { getIconComponent } = useServices();
  const { convert } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const savedOrders = localStorage.getItem('lovedktech_orders');
      if (savedOrders) {
        const allOrders: Order[] = JSON.parse(savedOrders);
        const userOrders = allOrders.filter(order => 
          order.userEmail === user.primaryEmailAddress?.emailAddress
        );
        // Sort by date descending
        userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(userOrders);
      }
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'review': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'in_progress': return 'In Development';
      case 'review': return 'In Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'in_progress', label: 'Development', icon: Code2Icon },
    { key: 'review', label: 'Review', icon: Smartphone },
    { key: 'completed', label: 'Deployed', icon: CheckCircle },
  ];

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-white/70 hover:text-white pl-0 hover:bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
              <h1 className="text-2xl font-bold">My Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* User Welcome */}
              <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'User'}!</h2>
                <p className="text-white/60">Track your active projects and orders here.</p>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Your Projects</h3>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                    <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 mb-6">No active projects found.</p>
                    <Button 
                      onClick={() => navigate("/")}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      Browse Services
                    </Button>
                  </div>
                ) : (
                  orders.map((order) => {
                    // We don't have the icon name stored in the order, so we might need to look it up or just use a generic one
                    // For now let's use a generic Package icon or try to map based on title if possible, 
                    // but ideally we should store iconName in the order. 
                    // Let's assume for now we just show a generic icon or get it from title context if we really wanted to be fancy.
                    // Actually, let's just use a default for now or pass it during checkout.
                    
                    const currentStepIndex = steps.findIndex(s => s.key === order.status);

                    return (
                      <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all hover:border-white/20">
                        <div className="flex flex-col md:flex-row gap-6 justify-between mb-8">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-cyan-500/20 rounded-xl">
                              <Package className="w-8 h-8 text-cyan-400" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{order.serviceTitle}</h4>
                              <p className="text-white/50 text-sm mt-1">Order ID: {order.id.slice(0, 8)}</p>
                              <p className="text-white/50 text-sm">Placed on: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                              {convert(order.price)} 
                              {/* Note: conversion might fluctuate if rates change, ideally store the formatted string or fixed price */}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />
                          <div 
                            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                            style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
                          />
                          
                          <div className="relative flex justify-between">
                            {steps.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              
                              return (
                                <div key={step.key} className="flex flex-col items-center gap-2">
                                  <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                      isCompleted 
                                        ? 'bg-cyan-500 border-cyan-500 text-white' 
                                        : 'bg-black border-white/20 text-white/30'
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                  </div>
                                  <span className={`text-xs md:text-sm font-medium ${isCompleted ? 'text-white' : 'text-white/30'}`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

// Helper component for icon
function Code2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
