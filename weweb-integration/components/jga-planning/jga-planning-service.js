import { supabase } from '@/lib/supabaseClient';
import { 
  JGAEvent, 
  JGADatePoll, 
  JGABudget, 
  JGAActivity, 
  JGATask, 
  JGASurpriseIdea, 
  JGAInvitation, 
  JGAPhoto 
} from '@/types/jga';

/**
 * WeWeb integration service for JGA Planning Module
 * This service connects the WeWeb no-code frontend with the backend functionality
 */

// JGA Event functions
export const getJGAEvents = async () => {
  const { data, error } = await supabase
    .from('jga_events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching JGA events:', error);
    throw new Error('Failed to fetch JGA events');
  }

  return data || [];
};

export const createJGAEvent = async (eventData) => {
  const { data, error } = await supabase
    .from('jga_events')
    .insert(eventData)
    .select()
    .single();

  if (error) {
    console.error('Error creating JGA event:', error);
    throw new Error('Failed to create JGA event');
  }

  return data;
};

export const updateJGAEvent = async (eventId, eventData) => {
  const { data, error } = await supabase
    .from('jga_events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    console.error('Error updating JGA event:', error);
    throw new Error('Failed to update JGA event');
  }

  return data;
};

export const deleteJGAEvent = async (eventId) => {
  const { error } = await supabase
    .from('jga_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting JGA event:', error);
    throw new Error('Failed to delete JGA event');
  }
};

// JGA Date Poll functions
export const getJGADatePolls = async () => {
  const { data, error } = await supabase
    .from('jga_date_polls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching JGA date polls:', error);
    throw new Error('Failed to fetch JGA date polls');
  }

  return data || [];
};

export const createJGADatePoll = async (pollData) => {
  const { data, error } = await supabase
    .from('jga_date_polls')
    .insert(pollData)
    .select()
    .single();

  if (error) {
    console.error('Error creating JGA date poll:', error);
    throw new Error('Failed to create JGA date poll');
  }

  return data;
};

export const voteOnJGADatePoll = async (pollId, userId, optionId) => {
  // First get the current poll to check if user has already voted
  const { data: poll, error: pollError } = await supabase
    .from('jga_date_polls')
    .select('*')
    .eq('id', pollId)
    .single();

  if (pollError) {
    console.error('Error fetching JGA date poll:', pollError);
    throw new Error('Failed to fetch JGA date poll');
  }

  // Update the votes array
  let votes = poll.votes || [];
  const existingVoteIndex = votes.findIndex(vote => vote.userId === userId);
  
  if (existingVoteIndex >= 0) {
    votes[existingVoteIndex].optionId = optionId;
  } else {
    votes.push({ userId, optionId });
  }

  // Update the poll with the new votes
  const { data, error } = await supabase
    .from('jga_date_polls')
    .update({ votes })
    .eq('id', pollId)
    .select()
    .single();

  if (error) {
    console.error('Error voting on JGA date poll:', error);
    throw new Error('Failed to vote on JGA date poll');
  }

  return data;
};

// JGA Budget functions
export const getJGABudgets = async () => {
  const { data, error } = await supabase
    .from('jga_budgets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching JGA budgets:', error);
    throw new Error('Failed to fetch JGA budgets');
  }

  return data || [];
};

export const createJGABudget = async (budgetData) => {
  const { data, error } = await supabase
    .from('jga_budgets')
    .insert(budgetData)
    .select()
    .single();

  if (error) {
    console.error('Error creating JGA budget:', error);
    throw new Error('Failed to create JGA budget');
  }

  return data;
};

export const addJGAExpense = async (budgetId, expenseData) => {
  // First get the current budget
  const { data: budget, error: budgetError } = await supabase
    .from('jga_budgets')
    .select('*')
    .eq('id', budgetId)
    .single();

  if (budgetError) {
    console.error('Error fetching JGA budget:', budgetError);
    throw new Error('Failed to fetch JGA budget');
  }

  // Update the expenses array
  let expenses = budget.expenses || [];
  expenses.push({
    id: Date.now().toString(),
    ...expenseData,
    createdAt: new Date().toISOString()
  });

  // Recalculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonAmount = budget.participants.length > 0 ? totalAmount / budget.participants.length : totalAmount;

  // Update the budget with the new expenses and amounts
  const { data, error } = await supabase
    .from('jga_budgets')
    .update({ 
      expenses, 
      totalAmount,
      perPersonAmount
    })
    .eq('id', budgetId)
    .select()
    .single();

  if (error) {
    console.error('Error adding JGA expense:', error);
    throw new Error('Failed to add JGA expense');
  }

  return data;
};

// JGA Activity functions
export const getJGAActivities = async () => {
  const { data, error } = await supabase
    .from('jga_activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching JGA activities:', error);
    throw new Error('Failed to fetch JGA activities');
  }

  return data || [];
};

export const createJGAActivity = async (activityData) => {
  const { data, error } = await supabase
    .from('jga_activities')
    .insert(activityData)
    .select()
    .single();

  if (error) {
    console.error('Error creating JGA activity:', error);
    throw new Error('Failed to create JGA activity');
  }

  return data;
};

export const voteOnJGAActivity = async (activityId, userId, vote) => {
  // First get the current activity
  const { data: activity, error: activityError } = await supabase
    .from('jga_activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (activityError) {
    console.error('Error fetching JGA activity:', activityError);
    throw new Error('Failed to fetch JGA activity');
  }

  // Update the votes array
  let votes = activity.votes || [];
  const existingVoteIndex = votes.findIndex(v => v.userId === userId);
  
  if (existingVoteIndex >= 0) {
    votes[existingVoteIndex].vote = vote;
  } else {
    votes.push({ userId, vote });
  }

  // Update the activity with the new votes
  const { data, error } = await supabase
    .from('jga_activities')
    .update({ votes })
    .eq('id', activityId)
    .select()
    .single();

  if (error) {
    console.error('Error voting on JGA activity:', error);
    throw new Error('Failed to vote on JGA activity');
  }

  return data;
};

// Export all functions for WeWeb integration
export default {
  getJGAEvents,
  createJGAEvent,
  updateJGAEvent,
  deleteJGAEvent,
  getJGADatePolls,
  createJGADatePoll,
  voteOnJGADatePoll,
  getJGABudgets,
  createJGABudget,
  addJGAExpense,
  getJGAActivities,
  createJGAActivity,
  voteOnJGAActivity
};
