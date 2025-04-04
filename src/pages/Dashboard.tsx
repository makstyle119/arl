import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Trophy } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabits } from '@/context/HabitContext';
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HabitCard from "@/components/habits/HabitCard";

const Dashboard = () => {
  const navigate = useNavigate();

  const { habits, loadingHabits } = useHabits();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("all");

  // Filter habits by category (all, active, inactive)
  const filteredHabits = habits.filter(habit => {
    if (activeTab === "active") {
      const today = new Date().toISOString().split('T')[0];
      return habit.completions.includes(today);
    }
    if (activeTab === "inactive") {
      const today = new Date().toISOString().split('T')[0];
      return !habit.completions.includes(today);
    }
    return true; // "all" tab
  });

  useEffect(() => {
    // This could be used to fetch additional user data or preferences
    if (user) {
      console.log("Dashboard mounted for user:", user.id);
    }
  }, [user]);

  // Get highest streak
  const highestStreak = habits.reduce((max, habit) => habit.streakCount > max ? habit.streakCount : max, 0);

  // Count habits completed today
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(habit => habit.completions.includes(today)).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/new-habit')}>
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Habits</CardDescription>
              <CardTitle className="flex items-center">
                <span className="text-3xl">{habits.length}</span>
                {!user?.isPremium && habits.length >= 5 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Max for free plan)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {user?.isPremium
                  ? "Unlimited habits with premium"
                  : `${habits.length}/5 habits used`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Today</CardDescription>
              <CardTitle className="text-3xl">
                {completedToday}/{habits.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-arl-500"
                  style={{
                    width: habits.length ? `${(completedToday / habits.length) * 100}%` : '0%'
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Highest Streak</CardDescription>
              <CardTitle className="flex items-center text-3xl">
                {highestStreak}
                {highestStreak > 0 && (
                  <Flame className="ml-2 w-6 h-6 text-arl-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {highestStreak === 0
                  ? "Start your first streak today!"
                  : "Keep the momentum going!"}
              </div>
            </CardContent>
          </Card>
        </div>

        {loadingHabits ? (
          <div className="text-center py-8">Loading your habits...</div>
        ) : habits.length === 0 ? (
          <Card className="text-center p-6">
            <CardContent className="pt-6 px-8">
              <Trophy className="w-16 h-16 text-arl-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground mb-6">
                Create your first habit to begin tracking your progress and building positive routines.
              </p>
              <Button onClick={() => navigate('/new-habit')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({habits.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Completed Today ({completedToday})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Not Completed ({habits.length - completedToday})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredHabits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No habits found in this category
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHabits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
