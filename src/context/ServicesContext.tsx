import React, { createContext, useContext, useState, useEffect } from 'react';
import { Layout, Globe, Database, Users, Cloud, Smartphone, MonitorSmartphone, Code2, Palette, type LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  iconName: string;
  title: string;
  description: string;
  priceEur: number;
}

interface ServicesContextType {
  services: Service[];
  updateServicePrice: (id: string, newPriceEur: number) => void;
  getIconComponent: (iconName: string) => LucideIcon;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Initial default services with updated EUR base prices (approximate based on previous USD)
const initialServices: Service[] = [
  {
    id: 'single-page',
    iconName: 'Layout',
    title: "Single Page Site",
    description: "Perfect for portfolios, landing pages, and small businesses. High impact, one-page experience.",
    priceEur: 400
  },
  {
    id: 'multi-page',
    iconName: 'Globe',
    title: "Multi-Page Site",
    description: "Comprehensive website (up to 5 pages) for businesses needing more content structure.",
    priceEur: 600
  },
  {
    id: 'erp',
    iconName: 'Database',
    title: "ERP Application",
    description: "Enterprise Resource Planning systems to streamline your business operations and data.",
    priceEur: 800
  },
  {
    id: 'crm',
    iconName: 'Users',
    title: "CRM Application",
    description: "Customer Relationship Management tools to boost sales and customer satisfaction.",
    priceEur: 800
  },
  {
    id: 'saas',
    iconName: 'Cloud',
    title: "SaaS Platform",
    description: "Scalable Software as a Service solutions built for growth and recurring revenue.",
    priceEur: 1000
  },
  {
    id: 'android',
    iconName: 'Smartphone',
    title: "Android Development",
    description: "Native Android applications tailored for the world's most popular mobile OS.",
    priceEur: 1200
  },
  {
    id: 'ios',
    iconName: 'Smartphone',
    title: "iOS Development",
    description: "Premium native iOS applications for iPhone and iPad ecosystems.",
    priceEur: 1200
  },
  {
    id: 'cross-platform',
    iconName: 'MonitorSmartphone',
    title: "Cross-Platform Mobile",
    description: "Efficient mobile apps that work seamlessly on both iOS and Android from a single codebase.",
    priceEur: 2200
  }
];

const iconMap: { [key: string]: LucideIcon } = {
  Layout,
  Globe,
  Database,
  Users,
  Cloud,
  Smartphone,
  MonitorSmartphone,
  Code2,
  Palette
};

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => {
    // Load from local storage if available
    const saved = localStorage.getItem('lovedktech_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  useEffect(() => {
    // Save to local storage whenever services change
    localStorage.setItem('lovedktech_services', JSON.stringify(services));
  }, [services]);

  const updateServicePrice = (id: string, newPriceEur: number) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, priceEur: newPriceEur } : service
    ));
  };

  const getIconComponent = (iconName: string) => {
    // console.log("Getting icon for:", iconName);
    const Icon = iconMap[iconName];
    if (!Icon) {
      console.warn(`Icon ${iconName} not found, using default.`);
      return Layout; // Use Layout as a safe default that we know is imported
    }
    return Icon;
  };

  return (
    <ServicesContext.Provider value={{ services, updateServicePrice, getIconComponent }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
