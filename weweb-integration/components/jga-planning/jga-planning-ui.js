import React from 'react';
import { 
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
} from './jga-planning-service';

/**
 * WeWeb UI Component for JGA Planning Module
 * This component provides the UI elements for the JGA Planning Module
 * that can be used in the WeWeb no-code editor
 */

export default {
  name: 'JGAPlanningModule',
  
  // Define the component properties that can be configured in WeWeb
  props: {
    title: {
      type: String,
      default: 'JGA-Planungsmodul'
    },
    description: {
      type: String,
      default: 'Planen Sie den perfekten Junggesellenabschied'
    },
    primaryColor: {
      type: String,
      default: '#4F46E5'
    },
    secondaryColor: {
      type: String,
      default: '#10B981'
    },
    fontFamily: {
      type: String,
      default: 'Inter, sans-serif'
    },
    borderRadius: {
      type: String,
      default: '0.5rem'
    },
    showDatePoll: {
      type: Boolean,
      default: true
    },
    showBudget: {
      type: Boolean,
      default: true
    },
    showActivities: {
      type: Boolean,
      default: true
    },
    showTasks: {
      type: Boolean,
      default: true
    },
    showSurpriseIdeas: {
      type: Boolean,
      default: true
    },
    showInvitations: {
      type: Boolean,
      default: true
    },
    showPhotoGallery: {
      type: Boolean,
      default: true
    }
  },
  
  // Define the data model for the component
  data() {
    return {
      events: [],
      datePolls: [],
      budgets: [],
      activities: [],
      tasks: [],
      surpriseIdeas: [],
      invitations: [],
      photos: [],
      loading: {
        events: false,
        datePolls: false,
        budgets: false,
        activities: false,
        tasks: false,
        surpriseIdeas: false,
        invitations: false,
        photos: false
      },
      error: {
        events: null,
        datePolls: null,
        budgets: null,
        activities: null,
        tasks: null,
        surpriseIdeas: null,
        invitations: null,
        photos: null
      },
      activeTab: 'datePoll'
    };
  },
  
  // Define the methods for the component
  methods: {
    // Tab navigation
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    
    // Events methods
    async fetchEvents() {
      this.loading.events = true;
      try {
        this.events = await getJGAEvents();
        this.error.events = null;
      } catch (err) {
        console.error('Error fetching events:', err);
        this.error.events = err.message;
      } finally {
        this.loading.events = false;
      }
    },
    
    async createEvent(eventData) {
      try {
        const newEvent = await createJGAEvent(eventData);
        this.events.unshift(newEvent);
        return newEvent;
      } catch (err) {
        console.error('Error creating event:', err);
        throw err;
      }
    },
    
    async updateEvent(eventId, eventData) {
      try {
        const updatedEvent = await updateJGAEvent(eventId, eventData);
        const index = this.events.findIndex(event => event.id === eventId);
        if (index !== -1) {
          this.events.splice(index, 1, updatedEvent);
        }
        return updatedEvent;
      } catch (err) {
        console.error('Error updating event:', err);
        throw err;
      }
    },
    
    async deleteEvent(eventId) {
      try {
        await deleteJGAEvent(eventId);
        const index = this.events.findIndex(event => event.id === eventId);
        if (index !== -1) {
          this.events.splice(index, 1);
        }
      } catch (err) {
        console.error('Error deleting event:', err);
        throw err;
      }
    },
    
    // Date Poll methods
    async fetchDatePolls() {
      this.loading.datePolls = true;
      try {
        this.datePolls = await getJGADatePolls();
        this.error.datePolls = null;
      } catch (err) {
        console.error('Error fetching date polls:', err);
        this.error.datePolls = err.message;
      } finally {
        this.loading.datePolls = false;
      }
    },
    
    async createDatePoll(pollData) {
      try {
        const newPoll = await createJGADatePoll(pollData);
        this.datePolls.unshift(newPoll);
        return newPoll;
      } catch (err) {
        console.error('Error creating date poll:', err);
        throw err;
      }
    },
    
    async voteOnDatePoll(pollId, userId, optionId) {
      try {
        const updatedPoll = await voteOnJGADatePoll(pollId, userId, optionId);
        const index = this.datePolls.findIndex(poll => poll.id === pollId);
        if (index !== -1) {
          this.datePolls.splice(index, 1, updatedPoll);
        }
        return updatedPoll;
      } catch (err) {
        console.error('Error voting on date poll:', err);
        throw err;
      }
    },
    
    // Budget methods
    async fetchBudgets() {
      this.loading.budgets = true;
      try {
        this.budgets = await getJGABudgets();
        this.error.budgets = null;
      } catch (err) {
        console.error('Error fetching budgets:', err);
        this.error.budgets = err.message;
      } finally {
        this.loading.budgets = false;
      }
    },
    
    async createBudget(budgetData) {
      try {
        const newBudget = await createJGABudget(budgetData);
        this.budgets.unshift(newBudget);
        return newBudget;
      } catch (err) {
        console.error('Error creating budget:', err);
        throw err;
      }
    },
    
    async addExpense(budgetId, expenseData) {
      try {
        const updatedBudget = await addJGAExpense(budgetId, expenseData);
        const index = this.budgets.findIndex(budget => budget.id === budgetId);
        if (index !== -1) {
          this.budgets.splice(index, 1, updatedBudget);
        }
        return updatedBudget;
      } catch (err) {
        console.error('Error adding expense:', err);
        throw err;
      }
    },
    
    // Activity methods
    async fetchActivities() {
      this.loading.activities = true;
      try {
        this.activities = await getJGAActivities();
        this.error.activities = null;
      } catch (err) {
        console.error('Error fetching activities:', err);
        this.error.activities = err.message;
      } finally {
        this.loading.activities = false;
      }
    },
    
    async createActivity(activityData) {
      try {
        const newActivity = await createJGAActivity(activityData);
        this.activities.unshift(newActivity);
        return newActivity;
      } catch (err) {
        console.error('Error creating activity:', err);
        throw err;
      }
    },
    
    async voteOnActivity(activityId, userId, vote) {
      try {
        const updatedActivity = await voteOnJGAActivity(activityId, userId, vote);
        const index = this.activities.findIndex(activity => activity.id === activityId);
        if (index !== -1) {
          this.activities.splice(index, 1, updatedActivity);
        }
        return updatedActivity;
      } catch (err) {
        console.error('Error voting on activity:', err);
        throw err;
      }
    }
  },
  
  // Lifecycle hooks
  mounted() {
    // Fetch initial data
    this.fetchEvents();
    this.fetchDatePolls();
    this.fetchBudgets();
    this.fetchActivities();
  },
  
  // Define the component template
  template: `
    <div 
      class="jga-planning-module" 
      :style="{
        fontFamily: fontFamily,
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
        '--border-radius': borderRadius
      }"
    >
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      
      <!-- Tab Navigation -->
      <div class="jga-tabs">
        <button 
          v-if="showDatePoll"
          :class="['jga-tab', { active: activeTab === 'datePoll' }]" 
          @click="setActiveTab('datePoll')"
        >
          Terminplanung
        </button>
        <button 
          v-if="showBudget"
          :class="['jga-tab', { active: activeTab === 'budget' }]" 
          @click="setActiveTab('budget')"
        >
          Budget
        </button>
        <button 
          v-if="showActivities"
          :class="['jga-tab', { active: activeTab === 'activities' }]" 
          @click="setActiveTab('activities')"
        >
          Aktivitäten
        </button>
        <button 
          v-if="showTasks"
          :class="['jga-tab', { active: activeTab === 'tasks' }]" 
          @click="setActiveTab('tasks')"
        >
          Aufgaben
        </button>
        <button 
          v-if="showSurpriseIdeas"
          :class="['jga-tab', { active: activeTab === 'surpriseIdeas' }]" 
          @click="setActiveTab('surpriseIdeas')"
        >
          Überraschungen
        </button>
        <button 
          v-if="showInvitations"
          :class="['jga-tab', { active: activeTab === 'invitations' }]" 
          @click="setActiveTab('invitations')"
        >
          Einladungen
        </button>
        <button 
          v-if="showPhotoGallery"
          :class="['jga-tab', { active: activeTab === 'photoGallery' }]" 
          @click="setActiveTab('photoGallery')"
        >
          Fotos
        </button>
      </div>
      
      <!-- Tab Content -->
      <div class="jga-tab-content">
        <!-- Date Poll Tab -->
        <div v-if="activeTab === 'datePoll' && showDatePoll" class="jga-tab-pane">
          <h2>Terminplanung</h2>
          <p>Stimmen Sie über mögliche Termine für den JGA ab.</p>
          
          <div v-if="loading.datePolls" class="jga-loading">
            Lädt Terminumfragen...
          </div>
          
          <div v-else-if="error.datePolls" class="jga-error">
            {{ error.datePolls }}
          </div>
          
          <div v-else-if="datePolls.length === 0" class="jga-empty">
            Keine Terminumfragen vorhanden. Erstellen Sie eine neue Umfrage.
          </div>
          
          <div v-else class="jga-date-polls">
            <div v-for="poll in datePolls" :key="poll.id" class="jga-date-poll">
              <h3>{{ poll.title }}</h3>
              <p>{{ poll.description }}</p>
              
              <div class="jga-date-options">
                <div v-for="option in poll.options" :key="option.id" class="jga-date-option">
                  <span>{{ new Date(option.date).toLocaleDateString() }}</span>
                  <span>{{ option.votes }} Stimmen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Budget Tab -->
        <div v-if="activeTab === 'budget' && showBudget" class="jga-tab-pane">
          <h2>Budget</h2>
          <p>Verwalten Sie das Budget für den JGA und teilen Sie die Kosten auf.</p>
          
          <div v-if="loading.budgets" class="jga-loading">
            Lädt Budgets...
          </div>
          
          <div v-else-if="error.budgets" class="jga-error">
            {{ error.budgets }}
          </div>
          
          <div v-else-if="budgets.length === 0" class="jga-empty">
            Kein Budget vorhanden. Erstellen Sie ein neues Budget.
          </div>
          
          <div v-else class="jga-budgets">
            <div v-for="budget in budgets" :key="budget.id" class="jga-budget">
              <h3>{{ budget.title }}</h3>
              <p>{{ budget.description }}</p>
              
              <div class="jga-budget-summary">
                <div class="jga-budget-total">
                  <span>Gesamtbetrag:</span>
                  <span>{{ budget.totalAmount.toFixed(2) }}€</span>
                </div>
                <div class="jga-budget-per-person">
                  <span>Pro Person:</span>
                  <span>{{ budget.perPersonAmount.toFixed(2) }}€</span>
                </div>
              </div>
              
              <div class="jga-budget-expenses">
                <h4>Ausgaben</h4>
                <div v-for="expense in budget.expenses" :key="expense.id" class="jga-expense">
                  <span>{{ expense.title }}</span>
                  <span>{{ expense.amount.toFixed(2) }}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activities Tab -->
        <div v-if="activeTab === 'activities' && showActivities" class="jga-tab-pane">
          <h2>Aktivitäten</h2>
          <p>Planen Sie Aktivitäten für den JGA und stimmen Sie darüber ab.</p>
          
          <div v-if="loading.activities" class="jga-loading">
            Lädt Aktivitäten...
          </div>
          
          <div v-else-if="error.activities" class="jga-error">
            {{ error.activities }}
          </div>
          
          <div v-else-if="activities.length === 0" class="jga-empty">
            Keine Aktivitäten vorhanden. Erstellen Sie eine neue Aktivität.
          </div>
          
          <div v-else class="jga-activities">
            <div v-for="activity in activities" :key="activity.id" class="jga-activity">
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.description }}</p>
              
              <div class="jga-activity-details">
                <div class="jga-activity-location">
                  <span>Ort:</span>
                  <span>{{ activity.location }}</span>
                </div>
                <div class="jga-activity-cost">
                  <span>Kosten:</span>
                  <span>{{ activity.cost.toFixed(2) }}€</span>
                </div>
                <div class="jga-activity-duration">
                  <span>Dauer:</span>
                  <span>{{ activity.duration }} Stunden</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Other tabs would be implemented similarly -->
      </div>
    </div>
  `,
  
  // Define the component styles
  style: `
    .jga-planning-module {
      font-family: var(--font-family, 'Inter, sans-serif');
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .jga-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    
    .jga-tab {
      padding: 0.75rem 1.5rem;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: var(--border-radius, 0.5rem);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .jga-tab.active {
      background-color: var(--primary-color, #4F46E5);
      color: white;
      border-color: var(--primary-color, #4F46E5);
    }
    
    .jga-tab-content {
      background-color: white;
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .jga-loading, .jga-error, .jga-empty {
      padding: 2rem;
      text-align: center;
      border-radius: var(--border-radius, 0.5rem);
      background-color: #f9fafb;
    }
    
    .jga-error {
      color: #ef4444;
      background-color: #fee2e2;
    }
    
    .jga-date-polls, .jga-budgets, .jga-activities {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .jga-date-poll, .jga-budget, .jga-activity {
      background-color: #f9fafb;
      border-radius: var(--border-radius, 0.5rem);
      padding: 1.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .jga-date-options, .jga-budget-expenses {
      margin-top: 1rem;
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
    }
    
    .jga-date-option, .jga-expense, .jga-activity-details > div {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .jga-budget-summary {
      display: flex;
      justify-content: space-between;
      background-color: var(--secondary-color, #10B981);
      color: white;
      padding: 1rem;
      border-radius: var(--border-radius, 0.5rem);
      margin: 1rem 0;
    }
  `
};
