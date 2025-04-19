import React from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Flame } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useHabits } from '@/context/HabitContext';
import HabitCalendar from '@/components/habits/HabitCalendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const HabitDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getHabitById, removeHabit, toggleHabitCompletion } = useHabits();

    const habit = getHabitById(id || '');

    if (!habit) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Habit not found</h2>
                    <p className="text-muted-foreground mb-6">The habit you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </div>
            </Layout>
        );
    }

    const createdDate = new Date(habit.createdAt);
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completions.includes(today);

    const handleToggleHabit = async () => {
        try {
            await toggleHabitCompletion(habit.id, today);
        } catch (error) {
            console.error('Error toggling habit:', error);
            toast.error('Failed to update habit completion');
        }
    };

    const handleDelete = async () => {
        try {
            await removeHabit(habit.id);
            toast.success('Habit deleted successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting habit:', error);
            toast.error('Failed to delete habit');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/dashboard')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">{habit.name}</h1>
                        {habit.streakCount > 0 && (
                            <div className="streak-badge">
                                <Flame className="w-3 h-3 mr-1" />
                                <span>{habit.streakCount}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={isCompletedToday ? "default" : "outline"}
                            className={isCompletedToday ? "bg-arl-500 hover:bg-arl-600" : ""}
                            onClick={handleToggleHabit}
                        >
                            {isCompletedToday ? 'Completed Today' : 'Mark as Complete'}
                        </Button>
                        {/* <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/edit-habit/${habit.id}`)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button> */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{habit.name}"? This action cannot be undone and you will lose all tracking data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Habit Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {habit.description && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                        <p>{habit.description}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
                                    <p>{createdDate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
                                    <p className="flex items-center">
                                        {habit.streakCount} days
                                        {habit.streakCount > 0 && <Flame className="ml-2 w-4 h-4 text-arl-500" />}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Total Completions</h3>
                                    <p>{habit.completions.length} times</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {/* <Button variant="outline" className="w-full" onClick={() => navigate('/calendar')}>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View in Calendar
                                </Button> */}
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <HabitCalendar habitId={habit.id} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HabitDetail;
