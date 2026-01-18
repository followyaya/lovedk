import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useCurrency } from "../context/CurrencyContext";
import { useServices } from "../context/ServicesContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { convert } = useCurrency();
  const { getIconComponent } = useServices();
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get service from navigation state or default to null
  const service = location.state?.service;

  useEffect(() => {
    if (!service) {
      // If accessed directly without a service, redirect to home
      navigate("/");
    }
  }, [service, navigate]);

  if (!service) return null;

  console.log("Service in Checkout:", service);
  
  // Safe icon resolution
  let IconComponent = CheckCircle;
  try {
    if (service.iconName) {
      const resolvedIcon = getIconComponent(service.iconName);
      if (resolvedIcon) {
        IconComponent = resolvedIcon;
      }
    }
  } catch (e) {
    console.error("Error resolving icon:", e);
  }

  const handleWhatsAppPayment = () => {
    const phoneNumber = "18652829928";
    const message = `New Order:
Service: ${service.title}
Price: ${convert(service.price)}
Client: ${user?.fullName} (${user?.primaryEmailAddress?.emailAddress})
Phone: ${phone}
Notes: ${notes}

I would like to proceed with payment.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new order object
    const newOrder = {
      id: crypto.randomUUID(),
      serviceId: service.id,
      serviceTitle: service.title,
      iconName: service.iconName,
      price: service.price, // Store base price in EUR
      currency: 'EUR',
      date: new Date().toISOString(),
      status: 'pending',
      userEmail: user?.primaryEmailAddress?.emailAddress,
      phone,
      notes
    };

    // Save to local storage
    const existingOrders = JSON.parse(localStorage.getItem('lovedktech_orders') || '[]');
    localStorage.setItem('lovedktech_orders', JSON.stringify([...existingOrders, newOrder]));

    setIsSubmitted(true);
    
    // Simulate email confirmation (frontend only)
    console.log("Order confirmed for:", user?.primaryEmailAddress?.emailAddress);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-white/70 mb-8">
            Thank you for your order. To complete the process, please proceed to payment via WhatsApp.
          </p>
          <Button 
            onClick={handleWhatsAppPayment}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 font-bold py-6 text-lg"
          >
            Pay Now via WhatsApp
          </Button>
          <Button 
            variant="link" 
            onClick={() => navigate("/")}
            className="mt-4 text-white/50 hover:text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-8 text-white/70 hover:text-white pl-0 hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Order Summary */}
              <div>
                <h1 className="text-4xl font-bold mb-2">Checkout</h1>
                <p className="text-white/60 mb-8">Complete your order details below</p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-cyan-500/20 rounded-xl">
                      <IconComponent className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{service.title}</h4>
                      <p className="text-white/60 text-sm mt-1">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                    <span className="text-white/70">Total</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                      {convert(service.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details Form */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm h-fit">
                <h3 className="text-xl font-semibold mb-6">Your Information</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Full Name</label>
                    <Input 
                      value={user?.fullName || ""} 
                      disabled 
                      className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Email Address</label>
                    <Input 
                      value={user?.primaryEmailAddress?.emailAddress || ""} 
                      disabled 
                      className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Phone Number (for WhatsApp)</label>
                    <Input 
                      required
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Additional Notes</label>
                    <Textarea 
                      placeholder="Any specific requirements or questions?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-cyan-400 min-h-[120px]"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0 font-bold py-6"
                  >
                    Confirm Order
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
