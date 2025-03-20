
import React from "react";
import { WorkMode } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWorkMode, formatDate } from "@/lib/email";
import { CheckCircle } from "lucide-react";

interface EmailSummaryProps {
  workMode: WorkMode;
  date: Date;
  email: string;
  onReset: () => void;
}

const EmailSummary: React.FC<EmailSummaryProps> = ({
  workMode,
  date,
  email,
  onReset,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-scale">
      <CardHeader className="pb-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-medium text-center">Work Mode Submitted</CardTitle>
        <CardDescription className="text-center">
          Your work mode preference has been sent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary/50 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Work Mode</p>
              <p className="font-medium">{formatWorkMode(workMode)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email Confirmation Sent To</p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} className="w-full btn-hover">
          Select Another Day
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailSummary;
