import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { AnimatedGradientBackground } from "../components/AnimatedGradient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import babelShopImg from "../assets/babel-shop.png";
import { useCurrency } from "../context/CurrencyContext";
import { useServices } from "../context/ServicesContext";
import { 
  Code2, Smartphone, Palette, Github, Linkedin, Twitter, Mail, 
  ExternalLink, Phone, Globe, Database, Cloud, Layout, MonitorSmartphone, Settings,
  LogOut, LayoutDashboard
} from "lucide-react";

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { currency, setCurrency, convert } = useCurrency();
  const { services, getIconComponent } = useServices();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct mailto link
    const subject = encodeURIComponent(`New Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    const mailtoLink = `mailto:followyaya@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    setFormData({ name: "", email: "", message: "" });
  };

  const handleServiceClick = (service: any) => {
    // Ensure we pass the price in a way Checkout expects (it expects .price to be the base amount in EUR for conversion)
    navigate('/checkout', { state: { service: { ...service, price: service.priceEur } } });
  };

  const projects = [
    {
      title: "Senparc Dakar",
      description: "Le Spot Fun pour Petits et Grands - Parc pour enfants sécurisé, trampolines, jeux gonflables, restaurant & gourmandises",
      image: "https://api.microlink.io/?url=https://senparcdakar.vercel.app/&screenshot=true&meta=false&embed=screenshot.url",
      tech: ["Next.js", "React", "Tailwind CSS"],
      link: "https://senparcdakar.vercel.app/",
    },
    {
      title: "Yarahman Dental",
      description: "Modern dental clinic website with appointment scheduling and service information",
      image: "https://api.microlink.io/?url=https://yarahmandental.vercel.app/&screenshot=true&meta=false&embed=screenshot.url",
      tech: ["Next.js", "React", "Tailwind CSS"],
      link: "https://yarahmandental.vercel.app/",
    },
    {
      title: "Weuzz Live Privé",
      description: "Exclusive live streaming and content platform",
      image: "https://image.thum.io/get/width/600/crop/800/https://weuzzliveprive.vercel.app/",
      tech: ["Next.js", "React", "Tailwind CSS"],
      link: "https://weuzzliveprive.vercel.app/",
    },
    {
      title: "Babel Shop Boutique",
      description: "Online boutique shop for fashion and lifestyle products",
      image: babelShopImg,
      tech: ["Next.js", "E-commerce", "Tailwind CSS"],
      link: "https://babelshopboutique.vercel.app/",
    },
    {
      title: "Luxury Perfume",
      description: "Elegant showcase website for luxury fragrances and perfumes",
      image: "https://api.microlink.io/?url=https://v0-luxury-perfume-website-zeta.vercel.app/&screenshot=true&meta=false&embed=screenshot.url",
      tech: ["Next.js", "React", "Tailwind CSS"],
      link: "https://v0-luxury-perfume-website-zeta.vercel.app/",
    },
    {
      title: "Jobad Gym",
      description: "Modern gym website with class schedules and membership plans",
      image: "https://image.thum.io/get/width/600/crop/800/https://v0-jobad-gym-website.vercel.app/",
      tech: ["Next.js", "React", "Tailwind CSS"],
      link: "https://v0-jobad-gym-website.vercel.app/",
    },
    {
      title: "Diaspora Trust",
      description: "A comprehensive platform connecting diaspora communities with trusted financial services and investment opportunities",
      image: "https://api.microlink.io/?url=https://www.diasporatrust.xyz/&screenshot=true&meta=false&embed=screenshot.url",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      link: "https://www.diasporatrust.xyz/",
    },
    {
      title: "Achly Tontine",
      description: "Modern digital solution for streamlined business operations and community engagement platform",
      image: "https://api.microlink.io/?url=https://achlytontine.com/&screenshot=true&meta=false&embed=screenshot.url",
      tech: ["React", "Node.js", "MongoDB"],
      link: "https://achlytontine.com/",
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Floating Currency Switcher & User Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-4 items-center flex-wrap justify-end">
        {/* User Dashboard & Logout */}
        {isSignedIn && (
          <>
            {user?.primaryEmailAddress?.emailAddress === "followyaya@gmail.com" ? (
              <Button
                onClick={() => navigate("/admin")}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            )}
            
            <SignOutButton>
              <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-all">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>
          </>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex border border-white/20">
          {(['USD', 'EUR', 'XOF'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currency === c 
                  ? 'bg-cyan-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGradientBackground />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
              love dk tech
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-12"
          >
            Transforming Ideas into Digital Reality
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl p-[2px]">
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                className="rounded-2xl px-8 py-6 text-base bg-black hover:bg-black/80 text-white"
              >
                View Projects
              </Button>
            </div>
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="rounded-2xl px-8 py-6 text-base bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white border-0"
            >
              Get in Touch
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="min-h-screen py-20 px-6 bg-gradient-to-b from-black via-purple-950/5 to-black relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">About Us</h2>
            <p className="text-xl text-white/70">Who we are and what we stand for</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left Column - Story */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold mb-6">Who We Are</h3>
              <p className="text-white/80 leading-relaxed text-lg">
                At <span className="text-cyan-400 font-semibold">love dk tech</span>, we are passionate about transforming ideas into powerful digital solutions. As a registered development company, we specialize in creating innovative web and mobile applications that drive real business results.
              </p>
              <p className="text-white/80 leading-relaxed text-lg">
                Founded by <span className="text-purple-400 font-semibold">Yaya Traore</span>, an entrepreneur and engineer with a unique blend of expertise, love dk tech is built on a foundation of technical excellence and business acumen. Holding two Master's degrees—one in Computer Engineering and another in Management & International Trade—Yaya combines deep technical prowess with a solid understanding of business dynamics.
              </p>
              <p className="text-white/80 leading-relaxed text-lg">
                This unique combination enables us to not only build exceptional technology but also understand the strategic needs of our clients, delivering solutions that truly align with business objectives and create meaningful impact for communities worldwide.
              </p>
              
              <div className="pt-6 space-y-4">
                <h4 className="text-2xl font-bold mb-4 text-cyan-400">Our Values</h4>
                <div className="space-y-3">
                  {[
                    { title: "Innovation-Driven", desc: "Pushing boundaries with cutting-edge technology" },
                    { title: "Client-Focused", desc: "Your success is our priority" },
                    { title: "Quality & Reliability", desc: "Building solutions that last" },
                    { title: "Community Impact", desc: "Creating positive change through technology" },
                  ].map((value, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">{value.title}</p>
                        <p className="text-white/60 text-sm">{value.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { value: "5+", label: "Years Experience" },
                { value: "50+", label: "Projects Delivered" },
                { value: "100%", label: "Client Satisfaction" },
                { value: "20+", label: "Technologies" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 group-hover:border-white/20 transition-all text-center h-full flex flex-col justify-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/70 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mission Statement Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-white/10 p-8 md:p-12"
          >
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                We empower businesses and communities by delivering innovative digital solutions that bridge ideas with execution. Through dedication, expertise, and a commitment to excellence, we transform visions into reality—one project at a time.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="min-h-screen py-20 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-white/70">What we can do for you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const IconComponent = getIconComponent(service.iconName);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative group block p-2 h-full w-full"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.span
                        className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 block rounded-3xl"
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 0.15 },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.15, delay: 0.2 },
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="rounded-2xl h-full w-full p-8 overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 relative z-20 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
                    <div className="relative z-50">
                      <IconComponent className="w-12 h-12 mb-4 text-cyan-400" />
                      <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                      <p className="text-white/70 leading-relaxed mb-4">{service.description}</p>
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6">
                        {convert(service.priceEur)}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleServiceClick(service)}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0 font-semibold relative z-50"
                    >
                      Get Started
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Featured Projects</h2>
            <p className="text-xl text-white/70">Our recent work</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.a
                key={idx}
                href={project.link}
                target={project.link !== "#" ? "_blank" : undefined}
                rel={project.link !== "#" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/70 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 text-white/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.link !== "#" && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-white/70">Let's build something amazing together</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-cyan-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-cyan-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-cyan-400 min-h-32"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl p-[2px]">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-xl bg-black hover:bg-black/80 text-white"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
                <p className="text-white/70 mb-8">
                  Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="https://wa.me/18652829928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-green-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-green-400/50 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>+1 865 282 9928</span>
                </a>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold mb-3 text-white/50">Business Information</h4>
                <div className="space-y-2 text-sm text-white/60">
                  <p>Registration: <span className="text-white/80">SNDKR2024A53814</span></p>
                  
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {[
                    { icon: Github, href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Twitter, href: "#" },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group"
                    >
                      <social.icon className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-white/50">
              © 2026 love dk tech. All rights reserved. Crafted with passion.
            </p>
          </div>
          <div className="text-center text-xs text-white/40 space-y-1">
            <p>Business Registration: SNDKR2024A53814</p>
          </div>
        </div>
      </footer>

      {/* Floating Navigation */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["hero", "about", "services", "projects", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="w-3 h-3 rounded-full bg-white/30 hover:bg-cyan-400 transition-all hover:scale-125"
              aria-label={`Scroll to ${section}`}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
