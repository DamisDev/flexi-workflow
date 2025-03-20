
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isWithinInterval, addMonths, startOfMonth, endOfMonth, getDay, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

type CalendarViewMode = "month" | "week" | "day";

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onDateSelect, selectedDate }) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
    }
  };

  const navigatePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => (
    <Calendar
      mode="single"
      selected={selectedDate || undefined}
      onSelect={handleDateSelect}
      month={currentDate}
      className="border rounded-md shadow-sm"
      initialFocus
    />
  );

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push(day);
    }
    
    return (
      <div className="w-full border rounded-md shadow-sm p-4">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day.toString()} className="text-center">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                {format(day, "EEE")}
              </div>
              <Button
                variant={selectedDate && day.toDateString() === selectedDate.toDateString() ? "default" : "ghost"}
                className="w-10 h-10 p-0 rounded-full"
                onClick={() => handleDateSelect(day)}
              >
                {format(day, "d")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => (
    <div className="w-full border rounded-md shadow-sm p-4">
      <div className="flex flex-col items-center">
        <div className="text-xl font-semibold mb-2">
          {format(currentDate, "EEEE")}
        </div>
        <div className="text-4xl font-bold mb-1">
          {format(currentDate, "d")}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(currentDate, "MMMM yyyy")}
        </div>
        <Button
          className="mt-4"
          variant={selectedDate && currentDate.toDateString() === selectedDate.toDateString() ? "default" : "outline"}
          onClick={() => handleDateSelect(currentDate)}
        >
          Select This Day
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          {viewMode === "month" && format(currentDate, "MMMM yyyy")}
          {viewMode === "week" && `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
          {viewMode === "day" && format(currentDate, "MMMM d, yyyy")}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="month" value={viewMode} onValueChange={(value) => setViewMode(value as CalendarViewMode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
        </TabsList>
        <TabsContent value="month" className="mt-4">
          {renderMonthView()}
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          {renderWeekView()}
        </TabsContent>
        <TabsContent value="day" className="mt-4">
          {renderDayView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarView;
