import React, { useState, useEffect } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Habit, HabitCompletion, habitService } from "@/services/habitService";
import { Check } from "lucide-react";

interface CalendarProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ habits, onToggleCompletion }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [completions, setCompletions] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  // Fetch completions for the current month when date or habits change
  useEffect(() => {
    if (habits.length === 0) {
      setLoading(false);
      return;
    }

    // Set the first habit as selected by default if nothing is selected
    if (!selectedHabit && habits.length > 0) {
      setSelectedHabit(habits[0].id);
    }

    fetchCompletionsForMonth();
  }, [date, habits, selectedHabit]);

  const fetchCompletionsForMonth = async () => {
    if (!selectedHabit) return;
    
    setLoading(true);
    try {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      
      const habitCompletions = await habitService.getHabitCompletions(
        selectedHabit,
        start,
        end
      );
      
      // Transform completions into a lookup object for easier access
      const newCompletions = { ...completions };
      
      if (!newCompletions[selectedHabit]) {
        newCompletions[selectedHabit] = {};
      }
      
      // Reset completions for the current habit and month
      eachDayOfInterval({ start, end }).forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        newCompletions[selectedHabit][dateStr] = false;
      });
      
      // Set completions from the database
      habitCompletions.forEach((completion: HabitCompletion) => {
        newCompletions[selectedHabit][completion.completed_date] = true;
      });
      
      setCompletions(newCompletions);
    } catch (error) {
      console.error("Error fetching completions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = async (day: Date) => {
    if (!selectedHabit) return;
    
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Don't allow marking future dates
    if (day > new Date()) return;
    
    try {
      await onToggleCompletion(selectedHabit);
      
      // Update the local state after the toggle
      const newCompletions = { ...completions };
      if (!newCompletions[selectedHabit]) {
        newCompletions[selectedHabit] = {};
      }
      
      newCompletions[selectedHabit][dateStr] = !newCompletions[selectedHabit][dateStr];
      setCompletions(newCompletions);
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const dayClassName = (date: Date) => {
    const today = new Date();
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = format(today, 'yyyy-MM-dd') === dateStr;
    
    if (!selectedHabit || !completions[selectedHabit]) return "";
    
    const isCompleted = completions[selectedHabit][dateStr];
    
    if (isCompleted) {
      return "bg-primary/10 text-primary rounded-full hover:bg-primary/20";
    }
    
    if (isToday) {
      return "border-primary border rounded-full hover:bg-primary/10";
    }
    
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Habit Calendar</h2>
        
        <div className="flex flex-wrap gap-2">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => setSelectedHabit(habit.id)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                selectedHabit === habit.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {habit.name}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Create habits to view your calendar</p>
        </div>
      ) : (
        <CalendarUI
          mode="single"
          selected={undefined}
          onSelect={() => {}}
          className="rounded-md border"
          month={date}
          onMonthChange={setDate}
          modifiers={{
            completed: (date) => {
              if (!selectedHabit || !completions[selectedHabit]) return false;
              const dateStr = format(date, 'yyyy-MM-dd');
              return !!completions[selectedHabit][dateStr];
            }
          }}
          modifiersClassNames={{
            completed: "bg-primary/10"
          }}
          components={{
            DayContent: ({ date }) => (
              <div 
                className={`w-full h-full flex items-center justify-center ${dayClassName(date)}`}
                onClick={() => handleDayClick(date)}
              >
                <span>{date.getDate()}</span>
                {selectedHabit && 
                  completions[selectedHabit] && 
                  completions[selectedHabit][format(date, 'yyyy-MM-dd')] && (
                  <Check className="h-3 w-3 absolute bottom-1 text-primary" />
                )}
              </div>
            )
          }}
        />
      )}
      
      <div className="flex items-center justify-center mt-4 gap-3">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary/10 mr-2"></div>
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border border-primary mr-2"></div>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
