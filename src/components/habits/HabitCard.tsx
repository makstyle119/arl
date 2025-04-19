import React from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Check, Flame } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useHabits, Habit } from '@/context/HabitContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface HabitCardProps {
  habit: Habit;
  showDetails?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, showDetails = true }) => {
  const { toggleHabitCompletion, getCurrentStreak } = useHabits();
  const today = new Date().toISOString().split('T')[0];

  const isCompletedToday = habit.completions.includes(today);
  const streak = getCurrentStreak(habit.id);

  const handleToggleHabit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleHabitCompletion(habit.id, today);
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast.error('Failed to update habit completion');
    }
  };

  return (
    <Link 
      to={`/habits/${habit.id}`} 
      className="block"
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span className="truncate">{habit.name}</span>
            {streak > 0 && (
              <div className="streak-badge animate-bounce-soft">
                <Flame className="w-3 h-3 mr-1" />
                <span>{streak}</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {habit.description && showDetails && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {habit.description}
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleToggleHabit}
            variant={isCompletedToday ? "default" : "outline"}
            className={`w-full ${isCompletedToday ? 'bg-arl-500 hover:bg-arl-600' : ''}`}
          >
            {isCompletedToday ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Mark As Completed
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default HabitCard;
