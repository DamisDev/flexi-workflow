
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WeeklyWorkModes } from "@/types";
import { format } from "date-fns";
import { formatWorkMode } from "@/lib/email";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HistoryEntry {
  weekStartDate: Date;
  workModes: WeeklyWorkModes;
  submittedAt: Date;
}

const History = () => {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const storedHistory = localStorage.getItem(`workmode_history_${user.id}`);
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory, (key, value) => {
            if (key === "weekStartDate" || key === "submittedAt") {
              return new Date(value);
            }
            return value;
          });
          setHistory(parsedHistory);
        } catch (error) {
          console.error("Error parsing history:", error);
        }
      }
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <div className="container mx-auto px-4 py-8">
            <p>Please log in to view your history.</p>
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
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">Work Schedule History</h1>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            
            {history.length === 0 ? (
              <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                <p className="text-muted-foreground">No previous work schedules found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="list" className="data-[state=active]:bg-[#a30000] data-[state=active]:text-white">List View</TabsTrigger>
                    <TabsTrigger value="email" className="data-[state=active]:bg-[#a30000] data-[state=active]:text-white">Email View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="list" className="mt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Week Starting</TableHead>
                          <TableHead>Submitted On</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {format(entry.weekStartDate, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {format(entry.submittedAt, "MMM d, yyyy HH:mm")}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {Object.entries(entry.workModes)
                                  .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                                  .map(([dateString, mode]) => 
                                    mode && (
                                      <div key={dateString} className="mb-1">
                                        <span className="font-medium">{format(new Date(dateString), "EEE, MMM d")}</span>: <span className="text-[#a30000]">{formatWorkMode(mode)}</span>
                                      </div>
                                    )
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="email" className="mt-0">
                    {history.map((entry, idx) => (
                      <div key={idx} className="mb-8 border-b pb-6">
                        <div className="mb-2 text-sm text-muted-foreground">
                          Submitted on {format(entry.submittedAt, "MMMM d, yyyy 'at' h:mm a")}
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          Week of {format(entry.weekStartDate, "MMMM d, yyyy")}
                        </h3>
                        <div className="bg-muted/30 p-4 rounded-md">
                          <p className="mb-4">Below are the work arrangements for the upcoming week</p>
                          <div className="space-y-2">
                            {Object.entries(entry.workModes)
                              .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                              .map(([dateString, mode]) => 
                                mode && (
                                  <div key={dateString}>
                                    <span className="font-medium">{format(new Date(dateString), "EEEE, MMMM d")}</span>: <span className="text-[#a30000]">{formatWorkMode(mode)}</span>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;
