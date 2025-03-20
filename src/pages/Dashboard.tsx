
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import WorkModeSelector from "@/components/WorkModeSelector";
import EmailSummary from "@/components/EmailSummary";
import { WorkMode } from "@/types";
import { sendWorkModeEmail } from "@/lib/email";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkModeSubmit = async (mode: WorkMode, date: Date) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const success = await sendWorkModeEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workMode: mode,
        date,
      });
      
      if (success) {
        setSelectedWorkMode(mode);
        setSelectedDate(date);
        setEmailSent(true);
        toast.success("Work mode selection sent successfully!");
      } else {
        toast.error("Failed to send work mode selection. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedWorkMode(null);
    setSelectedDate(null);
    setEmailSent(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {!isAuthenticated ? (
              <div className="max-w-md mx-auto py-8">
                <AuthForm />
              </div>
            ) : emailSent && selectedWorkMode && selectedDate ? (
              <div className="py-8">
                <EmailSummary
                  workMode={selectedWorkMode}
                  date={selectedDate}
                  email={user.email}
                  onReset={resetSelection}
                />
              </div>
            ) : (
              <div className="py-8">
                <WorkModeSelector onSubmit={handleWorkModeSubmit} />
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
