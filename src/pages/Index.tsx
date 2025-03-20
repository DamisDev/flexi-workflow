
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1 bg-blue-50 text-primary rounded-full text-sm font-medium"
            >
              Simplify Work Mode Selection
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
            >
              The smarter way to organize your <span className="text-primary">work flexibility</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Effortlessly manage your on-site and remote work schedule with just a few clicks
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-4"
            >
              <Link to="/dashboard">
                <Button size="lg" className="btn-hover">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-medium mb-4">Everything you need for flexible work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it simple to communicate your work preferences and keep everyone informed
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔄",
                title: "Simple Selection",
                description: "Choose your work mode for any day with just a few clicks",
              },
              {
                icon: "📱",
                title: "Works Everywhere",
                description: "Access from any device - desktop, tablet, or mobile phone",
              },
              {
                icon: "📧",
                title: "Automatic Emails",
                description: "Confirmation emails are sent automatically after selection",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <span className="text-4xl mb-4 inline-block">{feature.icon}</span>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center glass-card p-12 rounded-xl"
          >
            <h2 className="text-3xl font-medium mb-4">Ready to simplify your work mode management?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of professionals who are already enjoying the benefits of organized flexibility
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="btn-hover">
                Start Using FlexiWork
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
