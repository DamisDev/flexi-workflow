
import React, { useState, useEffect } from "react";
import { WorkMode, WeeklyWorkModes, WorkModeOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, startOfWeek, isWeekend, isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle, Calendar as CalendarIcon } from "lucide-react";

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

  // Initialize the work week
  useEffect(() => {
    const newWeeklyWorkModes: WeeklyWorkModes = {};
    
    // Create entries for Monday through Friday
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
    
    // Select Monday by default
    if (!selectedDay) {
      setSelectedDay(weekStartDate.toISOString());
    }
  }, [weekStartDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // If weekend, adjust to closest weekday
      let adjustedDate = date;
      if (isWeekend(date)) {
        // Move to Monday if it's a weekend
        adjustedDate = startOfWeek(date, { weekStartsOn: 1 });
      }
      
      // Update week start date to be Monday of the week
      const newWeekStartDate = startOfWeek(adjustedDate, { weekStartsOn: 1 });
      setWeekStartDate(newWeekStartDate);
      
      // Update selected date
      setSelectedDate(adjustedDate);
      
      // Set selected day
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
          className="flex flex-col items-center justify-center h-20 p-2 gap-1"
          onClick={() => handleDaySelect(date)}
        >
          <span className="text-xs font-medium">
            {format(date, "EEE")}
          </span>
          <span className="text-lg font-bold">
            {format(date, "d")}
          </span>
          {workMode && (
            <span className="text-xs mt-1">
              {workModeOptions.find(option => option.id === workMode)?.icon}
            </span>
          )}
        </Button>
      );
    }
    
    return days;
  };

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
          onClick={handleSubmitWeek} 
          disabled={!isAllDaysSelected() || isLoading}
          className="px-8"
        >
          {isLoading ? "Submitting..." : "Submit Weekly Schedule"}
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
