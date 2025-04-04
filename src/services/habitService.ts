import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  streak_count: number;
  created_at: string;
  user_id: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export const habitService = {
  // Create a new habit
  async createHabit({ name, description, category }: { name: string; description?: string; category?: string }): Promise<Habit | null> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name,
          description: description || null,
          category: category || null,
          user_id: userData.user.id,
          streak_count: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error creating habit:", error);
      return null;
    }
  },
  
  // Get all habits for the current user
  async getUserHabits(): Promise<Habit[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching habits:", error);
      return [];
    }
  },
  
  // Toggle completion of a habit for today
  async toggleHabitCompletion(habitId: string): Promise<boolean> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error("User not authenticated");
      
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Check if the habit is already completed for today
      const { data: existingCompletion, error: fetchError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', userData.user.id)
        .eq('completed_date', today)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
        throw fetchError;
      }
      
      // If already completed, remove the completion
      if (existingCompletion) {
        const { error: deleteError } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existingCompletion.id);
          
        if (deleteError) throw deleteError;
        
        return false; // Habit is now not completed
      } 
      // Otherwise, mark as completed
      else {
        const { error: insertError } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: userData.user.id,
            completed_date: today
          });
          
        if (insertError) throw insertError;
        
        return true; // Habit is now completed
      }
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      throw error;
    }
  },
  
  // Get habit completions for a date range
  async getHabitCompletions(habitId: string, startDate: Date, endDate: Date): Promise<HabitCompletion[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('user_id', userData.user.id)
        .gte('completed_date', format(startDate, 'yyyy-MM-dd'))
        .lte('completed_date', format(endDate, 'yyyy-MM-dd'));
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching habit completions:", error);
      return [];
    }
  },
  
  // Delete a habit
  async deleteHabit(habitId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error deleting habit:", error);
      return false;
    }
  },
  
  // Update a habit
  async updateHabit(habitId: string, updates: { name?: string, description?: string | null, category?: string | null }): Promise<Habit | null> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error updating habit:", error);
      return null;
    }
  }
};
