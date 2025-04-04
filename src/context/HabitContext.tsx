import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types
export type Habit = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    completions: string[]; // Array of ISO date strings when the habit was completed
    streakCount: number;
    category?: string;
};

type HabitContextType = {
    habits: Habit[];
    loadingHabits: boolean;
    addHabit: (name: string, description?: string, category?: string) => Promise<void>;
    removeHabit: (id: string) => Promise<void>;
    toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
    isHabitCompletedOnDate: (habitId: string, date: string) => boolean;
    getCurrentStreak: (habitId: string) => number;
    getHabitById: (id: string) => Habit | undefined;
};

// Create context
const HabitContext = createContext<HabitContextType>({
    habits: [],
    loadingHabits: true,
    addHabit: async () => { },
    removeHabit: async () => { },
    toggleHabitCompletion: async () => { },
    isHabitCompletedOnDate: () => false,
    getCurrentStreak: () => 0,
    getHabitById: () => undefined,
});

// Hook for easier context usage
export const useHabits = () => useContext(HabitContext);

// Provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loadingHabits, setLoadingHabits] = useState(true);

    // Load habits from Supabase when user changes
    useEffect(() => {
        const fetchHabits = async () => {
            if (!user) {
                // setHabits([]);
                // setLoadingHabits(false);
                return;
            }

            try {
                // Fetch habits from Supabase
                const { data: habitsData, error: habitsError } = await supabase
                    .from('habits')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (habitsError) {
                    throw habitsError;
                }

                // Fetch all completions for this user's habits
                const { data: completionsData, error: completionsError } = await supabase
                    .from('habit_completions')
                    .select('habit_id, completed_date')
                    .eq('user_id', user.id);

                if (completionsError) {
                    throw completionsError;
                }

                // Group completions by habit id
                const completionsByHabit: Record<string, string[]> = {};
                completionsData.forEach((completion) => {
                    if (!completionsByHabit[completion.habit_id]) {
                        completionsByHabit[completion.habit_id] = [];
                    }
                    completionsByHabit[completion.habit_id].push(completion.completed_date);
                });

                // Map database habits to our habit format
                const formattedHabits: Habit[] = habitsData.map((habit) => ({
                    id: habit.id,
                    name: habit.name,
                    description: habit.description || undefined,
                    createdAt: habit.created_at,
                    streakCount: habit.streak_count,
                    completions: completionsByHabit[habit.id] || [],
                    category: habit.category || undefined
                }));

                setHabits(formattedHabits);
            } catch (error) {
                console.error('Error loading habits:', error);
                toast.error('Failed to load habits');
            } finally {
                setLoadingHabits(false);
            }
        };

        fetchHabits();
    }, [user]);

    // Add a new habit to Supabase
    const addHabit = async (name: string, description?: string, category?: string) => {
        if (!user) {
            toast.error('You must be logged in to add habits');
            throw new Error('User not authenticated');
        }

        if (!name.trim()) {
            toast.error('Habit name cannot be empty');
            throw new Error('Habit name is required');
        }

        // For free users, limit to 5 habits
        if (!user.isPremium && habits.length >= 5) {
            toast.error('Free plan is limited to 5 habits. Upgrade to premium for unlimited habits!');
            throw new Error('Habit limit reached for free plan');
        }

        try {
            const { data: newHabit, error } = await supabase
                .from('habits')
                .insert({
                    user_id: user.id,
                    name: name.trim(),
                    description: description?.trim(),
                    category,
                })
                .select()
                .single();

            if (error) throw error;

            // Add new habit to state
            const formattedHabit: Habit = {
                id: newHabit.id,
                name: newHabit.name,
                description: newHabit.description || undefined,
                createdAt: newHabit.created_at,
                streakCount: 0,
                completions: [],
                category: newHabit.category || undefined
            };

            setHabits(prev => [formattedHabit, ...prev]);
            toast.success('Habit created successfully!');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error creating habit:', error);
            toast.error(error.message || 'Failed to create habit');
            throw error;
        }
    };

    // Remove a habit from Supabase
    const removeHabit = async (id: string) => {
        if (!user) {
            toast.error('You must be logged in to remove habits');
            throw new Error('User not authenticated');
        }

        try {
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;

            setHabits(prev => prev.filter(habit => habit.id !== id));
            toast.success('Habit removed');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error removing habit:', error);
            toast.error(error.message || 'Failed to remove habit');
            throw error;
        }
    };

    // Toggle habit completion in Supabase
    const toggleHabitCompletion = async (habitId: string, date: string) => {
        if (!user) {
            toast.error('You must be logged in to track habits');
            throw new Error('User not authenticated');
        }

        try {
            const isCompleted = isHabitCompletedOnDate(habitId, date);

            if (isCompleted) {
                // Delete completion if already completed
                const { error } = await supabase
                    .from('habit_completions')
                    .delete()
                    .eq('habit_id', habitId)
                    .eq('user_id', user.id)
                    .eq('completed_date', date);

                if (error) throw error;

                // Update local state
                setHabits(prev =>
                    prev.map(habit => {
                        if (habit.id === habitId) {
                            return {
                                ...habit,
                                completions: habit.completions.filter(d => d !== date)
                                // streakCount will be updated via the database trigger
                            };
                        }
                        return habit;
                    })
                );

                toast.info('Habit marked as incomplete');
            } else {
                // Insert new completion
                const { error } = await supabase
                    .from('habit_completions')
                    .insert({
                        habit_id: habitId,
                        user_id: user.id,
                        completed_date: date
                    });

                if (error) throw error;

                // Update local state (temporarily until we refetch)
                setHabits(prev =>
                    prev.map(habit => {
                        if (habit.id === habitId) {
                            const newCompletions = [...habit.completions, date];
                            return {
                                ...habit,
                                completions: newCompletions
                                // streakCount will be updated via the database trigger
                            };
                        }
                        return habit;
                    })
                );

                toast.success('Habit completed! 🎉');
            }

            // Fetch the updated habit to get the correct streak count
            const { data: updatedHabit, error: habitError } = await supabase
                .from('habits')
                .select('streak_count')
                .eq('id', habitId)
                .single();

            if (habitError) throw habitError;

            // Update the streak count in local state
            setHabits(prev =>
                prev.map(habit => {
                    if (habit.id === habitId) {
                        return {
                            ...habit,
                            streakCount: updatedHabit.streak_count
                        };
                    }
                    return habit;
                })
            );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error toggling habit completion:', error);
            toast.error(error.message || 'Failed to update habit completion');
            throw error;
        }
    };

    // Check if a habit was completed on a specific date
    const isHabitCompletedOnDate = (habitId: string, date: string): boolean => {
        const habit = habits.find(h => h.id === habitId);
        return habit ? habit.completions.includes(date) : false;
    };

    // Get current streak for a habit
    const getCurrentStreak = (habitId: string): number => {
        const habit = habits.find(h => h.id === habitId);
        return habit ? habit.streakCount : 0;
    };

    // Get a habit by ID
    const getHabitById = (id: string): Habit | undefined => {
        return habits.find(habit => habit.id === id);
    };

    return (
        <HabitContext.Provider
            value={{
                habits,
                loadingHabits,
                addHabit,
                removeHabit,
                toggleHabitCompletion,
                isHabitCompletedOnDate,
                getCurrentStreak,
                getHabitById,
            }}
        >
            {children}
        </HabitContext.Provider>
    );
};