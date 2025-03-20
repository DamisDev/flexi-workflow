
import React from "react";
import { WorkModeOption } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface WorkModeCardProps {
  option: WorkModeOption;
  isSelected: boolean;
  onClick: () => void;
}

const WorkModeCard: React.FC<WorkModeCardProps> = ({
  option,
  isSelected,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative p-6 rounded-xl cursor-pointer transition-all duration-300 glass-card",
        isSelected
          ? "ring-2 ring-primary/70 shadow-medium"
          : "hover:shadow-soft"
      )}
      onClick={onClick}
    >
      {isSelected && (
        <span className="absolute top-3 right-3 text-primary">
          <CheckCircle className="h-5 w-5" />
        </span>
      )}
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={cn(
            "p-4 rounded-full",
            isSelected
              ? "bg-primary text-white"
              : "bg-secondary text-primary"
          )}
        >
          <span className="text-2xl" dangerouslySetInnerHTML={{ __html: option.icon }} />
        </div>
        <h3 className="font-medium text-lg">{option.title}</h3>
        <p className="text-sm text-muted-foreground">{option.description}</p>
      </div>
    </motion.div>
  );
};

export default WorkModeCard;
