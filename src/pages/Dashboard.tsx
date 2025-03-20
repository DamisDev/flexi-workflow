
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import WeeklySummary from "@/components/WeeklySummary";
import CalendarView from "@/components/CalendarView";
import { WorkMode, WeeklyWorkModes } from "@/types";
import { sendWeeklyWorkModeEmail } from "@/lib/email";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { startOfWeek } from "date-fns";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [weeklyWorkModes, setWeeklyWorkModes] = useState<WeeklyWorkModes>({});
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWeeklySubmit = async (workModes: WeeklyWorkModes, startDate: Date) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const success = await sendWeeklyWorkModeEmail({
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workModes,
        weekStartDate: startDate,
      });
      
      if (success) {
        setWeeklyWorkModes(workModes);
        setWeekStartDate(startDate);
        setEmailSent(true);
        toast.success("Weekly schedule submitted successfully!");
      } else {
        toast.error("Failed to submit weekly schedule. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setWeeklyWorkModes({});
    setEmailSent(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto py-8"
            >
              <AuthForm />
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[600px] rounded-lg border"
            >
              <ResizablePanel defaultSize={30} minSize={25}>
                <div className="p-6">
                  <h2 className="text-2xl font-medium mb-6">Calendar</h2>
                  <CalendarView 
                    onDateSelect={handleDateSelect} 
                    selectedDate={selectedDate}
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={70}>
                <div className="p-6">
                  {emailSent ? (
                    <WeeklySummary
                      workModes={weeklyWorkModes}
                      weekStartDate={weekStartDate}
                      email={user.email}
                      onReset={resetSelection}
                    />
                  ) : (
                    <WeeklyPlanner 
                      onSubmit={handleWeeklySubmit} 
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
