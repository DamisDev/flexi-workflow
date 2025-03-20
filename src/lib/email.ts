
import { WorkMode, WeeklyWorkModes } from "@/types";

interface SendEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  workMode: WorkMode;
  date: Date;
}

interface SendWeeklyEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  workModes: WeeklyWorkModes;
  weekStartDate: Date;
}

export const formatWorkMode = (mode: WorkMode): string => {
  switch (mode) {
    case "full-remote":
      return "Smart working (full day)";
    case "on-site":
      return "On-site presence";
    case "remote-morning":
      return "Smart working only in the morning";
    case "remote-afternoon":
      return "Smart working only in the afternoon";
    default:
      return "Unknown work mode";
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const sendWorkModeEmail = async ({
  to,
  firstName,
  lastName,
  workMode,
  date,
}: SendEmailParams): Promise<boolean> => {
  // In a real application, this would connect to a backend API
  // that would send the actual email
  
  // For now, we'll simulate sending an email
  console.log(`Sending email to: ${to}`);
  console.log(`Work mode selection: ${formatWorkMode(workMode)}`);
  console.log(`For date: ${formatDate(date)}`);
  
  // Simulate network request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful email sending
  return true;
};

export const sendWeeklyWorkModeEmail = async ({
  to,
  firstName,
  lastName,
  workModes,
  weekStartDate,
}: SendWeeklyEmailParams): Promise<boolean> => {
  // In a real application, this would connect to a backend API
  // that would send the actual email
  
  // For now, we'll simulate sending an email
  console.log(`Sending weekly email to: ${to}`);
  console.log(`Week starting: ${formatDate(weekStartDate)}`);
  
  // Log each day's work mode
  Object.entries(workModes).forEach(([dateString, mode]) => {
    if (mode) {
      const date = new Date(dateString);
      console.log(`${formatDate(date)}: ${formatWorkMode(mode)}`);
    }
  });
  
  // Simulate network request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful email sending
  return true;
};
