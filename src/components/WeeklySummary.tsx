
import React, { useEffect } from "react";
import { WeeklyWorkModes } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWorkMode } from "@/lib/email";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface WeeklySummaryProps {
  workModes: WeeklyWorkModes;
  weekStartDate: Date;
  email: string;
  onReset: () => void;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  workModes,
  weekStartDate,
  email,
}) => {
  const navigate = useNavigate();
  
  // Automatically redirect to dashboard after a delay
  useEffect(() => {
    console.log("Setting up redirect timer");
    
    const timer = setTimeout(() => {
      console.log("Timer expired, redirecting to dashboard");
      navigate('/dashboard');
    }, 5000);
    
    // Cleanup function to clear the timeout if component unmounts
    return () => {
      console.log("Cleaning up timer");
      clearTimeout(timer);
    };
  }, []); // Empty dependency array ensures this runs only once when component mounts

  return (
    <Card className="w-full max-w-lg mx-auto border shadow-sm">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-xl font-medium text-center">Weekly Schedule Submitted</CardTitle>
        <CardDescription className="text-center">
          Your work mode preferences for the week have been sent.
          <br />You will be redirected to the dashboard in a few seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-medium">Week of {format(weekStartDate, "MMMM d, yyyy")}</h3>
            <p className="text-sm text-muted-foreground">Email confirmation sent to {email}</p>
          </div>
          <div className="divide-y">
            {Object.entries(workModes)
              .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
              .map(([dateString, mode]) => {
                if (!mode) return null;
                const date = new Date(dateString);
                return (
                  <div key={dateString} className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{format(date, "EEEE")}</p>
                      <p className="text-sm text-muted-foreground">{format(date, "MMMM d")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatWorkMode(mode)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;
