import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useHabits, Habit } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HabitCalendarProps {
    habitId?: string;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habitId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(habitId);
    const { habits, toggleHabitCompletion, isHabitCompletedOnDate } = useHabits();

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' });
    };

    const handleDateClick = (day: number) => {
        if (!selectedHabitId) return;

        const clickedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        ).toISOString().split('T')[0];

        const today = new Date().toISOString().split('T')[0];
        if (clickedDate > today) return; // Can't mark future dates

        toggleHabitCompletion(selectedHabitId, clickedDate);
    };

    const getDayClassName = (day: number) => {
        if (!selectedHabitId) return 'calendar-day future';

        const dateToCheck = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        ).toISOString().split('T')[0];

        const today = new Date().toISOString().split('T')[0];
        const isCompleted = isHabitCompletedOnDate(selectedHabitId, dateToCheck);

        // Check if date is in the future
        if (dateToCheck > today) {
            return 'calendar-day future';
        }

        // Check for streak
        if (isCompleted) {
            // Check if previous day was completed too (for streak)
            const prevDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day - 1
            ).toISOString().split('T')[0];

            const isPrevDayCompleted = isHabitCompletedOnDate(selectedHabitId, prevDate);

            if (isPrevDayCompleted) {
                return 'calendar-day streak';
            }

            return 'calendar-day completed';
        }

        // Past date that was not completed
        if (dateToCheck < today) {
            return 'calendar-day missed';
        }

        // Today, not completed yet
        return 'calendar-day';
    };

    const getSelectedHabit = (): Habit | undefined => {
        return habits.find(h => h.id === selectedHabitId);
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>Habit Calendar</CardTitle>
                    {/* {habits.length > 0 && (
                        <Select
                            value={selectedHabitId}
                            onValueChange={(value) => setSelectedHabitId(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a habit" />
                            </SelectTrigger>
                            <SelectContent>
                                {habits.map((habit) => (
                                    <SelectItem key={habit.id} value={habit.id}>
                                        {habit.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )} */}
                </div>
            </CardHeader>
            <CardContent>
                {habits.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">No habits to display on the calendar</p>
                        <Button asChild>
                            <a href="/new-habit">Create your first habit</a>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <Button variant="outline" size="icon" onClick={previousMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    {getMonthName(currentDate)} {currentDate.getFullYear()}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={goToCurrentMonth}
                                    className="text-xs h-7"
                                >
                                    Today
                                </Button>
                            </div>
                            <Button variant="outline" size="icon" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {weekdays.map((day) => (
                                <div key={day} className="p-2 text-xs font-medium text-muted-foreground">
                                    {day}
                                </div>
                            ))}

                            {/* Empty cells for days before the first day of month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                                <div key={`empty-${index}`} className="p-2"></div>
                            ))}

                            {/* Calendar days */}
                            {Array.from({ length: daysInMonth }).map((_, index) => {
                                const day = index + 1;
                                return (
                                    <div
                                        key={`day-${day}`}
                                        className="p-1"
                                        onClick={() => handleDateClick(day)}
                                    >
                                        <button
                                            className={getDayClassName(day)}
                                            disabled={!selectedHabitId}
                                        >
                                            {day}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        {selectedHabitId && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-sm font-semibold mb-2">Legend:</h4>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-arl-500 rounded-full mr-2"></div>
                                        <span>Completed</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-arl-500 rounded-full mr-2 animate-pulse-custom"></div>
                                        <span>Streak</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-destructive/20 rounded-full mr-2"></div>
                                        <span>Missed</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default HabitCalendar;
