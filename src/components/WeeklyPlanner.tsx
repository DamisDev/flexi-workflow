import React, { useState, useEffect } from "react";
import { WorkMode, WeeklyWorkModes, WorkModeOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, startOfWeek, isWeekend, isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle, Calendar as CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";

interface WeeklyPlannerProps {
  onSubmit: (workModes: WeeklyWorkModes, weekStartDate: Date) => void;
  isLoading: boolean;
}

const workModeOptions: WorkModeOption[] = [
  {
    id: "full-remote",
    title: "Smart Working",
    description: "Work remotely for the full day",
    icon: "🏠",
  },
  {
    id: "on-site",
    title: "On-site",
    description: "Present at the office for the full day",
    icon: "🏢",
  },
  {
    id: "remote-morning",
    title: "Remote Morning",
    description: "Work remotely in the morning, on-site in the afternoon",
    icon: "☀️",
  },
  {
    id: "remote-afternoon",
    title: "Remote Afternoon",
    description: "Work on-site in the morning, remotely in the afternoon",
    icon: "🌙",
  },
];

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ onSubmit, isLoading }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [weeklyWorkModes, setWeeklyWorkModes] = useState<WeeklyWorkModes>({});
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    const newWeeklyWorkModes: WeeklyWorkModes = {};
    
    for (let i = 0; i < 5; i++) {
      const date = addDays(weekStartDate, i);
      const dateString = date.toISOString();
      if (!weeklyWorkModes[dateString]) {
        newWeeklyWorkModes[dateString] = null;
      } else {
        newWeeklyWorkModes[dateString] = weeklyWorkModes[dateString];
      }
    }
    
    setWeeklyWorkModes(prev => ({ ...prev, ...newWeeklyWorkModes }));
    
    if (!selectedDay) {
      setSelectedDay(weekStartDate.toISOString());
    }
  }, [weekStartDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      let adjustedDate = date;
      if (isWeekend(date)) {
        adjustedDate = startOfWeek(date, { weekStartsOn: 1 });
      }
      
      const newWeekStartDate = startOfWeek(adjustedDate, { weekStartsOn: 1 });
      setWeekStartDate(newWeekStartDate);
      
      setSelectedDate(adjustedDate);
      
      setSelectedDay(adjustedDate.toISOString());
    }
  };

  const handleDaySelect = (date: Date) => {
    const dateString = date.toISOString();
    setSelectedDay(dateString);
  };

  const handleWorkModeSelect = (mode: WorkMode) => {
    if (selectedDay) {
      setWeeklyWorkModes(prev => ({
        ...prev,
        [selectedDay]: mode
      }));
    }
  };

  const handleSubmitWeek = () => {
    onSubmit(weeklyWorkModes, weekStartDate);
  };

  const isWorkModeSelected = (mode: WorkMode): boolean => {
    return selectedDay ? weeklyWorkModes[selectedDay] === mode : false;
  };

  const isAllDaysSelected = (): boolean => {
    return Object.values(weeklyWorkModes).every(mode => mode !== null);
  };

  const getWorkModeLabel = (mode: WorkMode | null): string => {
    if (!mode) return "";
    switch (mode) {
      case "full-remote": return "Smart Working";
      case "on-site": return "On-site";
      case "remote-morning": return "Remote Morning";
      case "remote-afternoon": return "Remote Afternoon";
      default: return "";
    }
  };

  const renderWeekDays = () => {
    const days = [];
    
    for (let i = 0; i < 5; i++) {
      const date = addDays(weekStartDate, i);
      const dateString = date.toISOString();
      const isSelected = selectedDay === dateString;
      const workMode = weeklyWorkModes[dateString];
      
      days.push(
        <Button
          key={dateString}
          variant={isSelected ? "default" : "outline"}
          className="flex flex-col items-center justify-center h-auto p-2 gap-1 min-h-20"
          onClick={() => handleDaySelect(date)}
        >
          <span className="text-xs font-medium">
            {format(date, "EEE")}
          </span>
          <span className="text-lg font-bold">
            {format(date, "d")}
          </span>
          {workMode && (
            <span className="text-xs mt-1 text-center">
              {getWorkModeLabel(workMode)}
            </span>
          )}
        </Button>
      );
    }
    
    return days;
  };

  if (isReviewMode) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-medium">Review Your Schedule</h2>
              <p className="text-muted-foreground">
                Week of {format(weekStartDate, "MMMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-md p-6 space-y-4">
            <h3 className="text-lg font-medium mb-4">Weekly Schedule Summary</h3>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(weeklyWorkModes)
                .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                .map(([dateString, mode]) => {
                  const date = new Date(dateString);
                  return (
                    <div key={dateString} className="border rounded-lg p-4 flex flex-col items-center">
                      <div className="text-sm font-medium">{format(date, "EEE")}</div>
                      <div className="text-xl font-bold">{format(date, "d")}</div>
                      <div className="text-sm mt-2">{getWorkModeLabel(mode)}</div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsReviewMode(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </Button>
              <Button 
                onClick={handleSubmitWeek} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? "Submitting..." : "Confirm & Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-medium">Weekly Planning</h2>
            <p className="text-muted-foreground">
              Week of {format(weekStartDate, "MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Select days in the calendar to plan your work mode
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {renderWeekDays()}
        </div>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">
            {selectedDay ? `Work Mode for ${format(new Date(selectedDay), "EEEE, MMMM d")}` : "Select a day"}
          </h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {workModeOptions.map((option) => (
              <Card 
                key={option.id}
                className={`relative cursor-pointer hover:shadow-md transition-all ${
                  isWorkModeSelected(option.id) ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleWorkModeSelect(option.id)}
              >
                {isWorkModeSelected(option.id) && (
                  <span className="absolute top-2 right-2 text-primary">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                )}
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="mb-2 text-xl">{option.icon}</div>
                  <CardTitle className="text-sm font-medium mb-1">{option.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => setIsReviewMode(true)} 
          disabled={!isAllDaysSelected()}
          className="px-8 flex items-center gap-2"
        >
          Review Schedule
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
