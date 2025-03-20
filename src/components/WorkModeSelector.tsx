
import React, { useState } from "react";
import { WorkMode, WorkModeOption } from "@/types";
import WorkModeCard from "@/components/ui/WorkModeCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WorkModeSelectorProps {
  onSubmit: (mode: WorkMode, date: Date) => void;
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

const WorkModeSelector: React.FC<WorkModeSelectorProps> = ({ onSubmit }) => {
  const [selectedMode, setSelectedMode] = useState<WorkMode | null>(null);
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    if (!selectedMode) return;
    onSubmit(selectedMode, date);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-medium"
        >
          Select Your Work Mode
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Choose how you'd like to work for
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"link"}
                className="px-1 font-semibold text-primary"
              >
                {format(date, "MMMM dd, yyyy")}
                <CalendarIcon className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {workModeOptions.map((option) => (
          <motion.div key={option.id} variants={item}>
            <WorkModeCard
              option={option}
              isSelected={selectedMode === option.id}
              onClick={() => setSelectedMode(option.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleSubmit}
          disabled={!selectedMode}
          size="lg"
          className="px-8 btn-hover"
        >
          Submit Work Mode
        </Button>
      </motion.div>
    </div>
  );
};

export default WorkModeSelector;
