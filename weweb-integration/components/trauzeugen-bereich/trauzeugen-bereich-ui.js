// Trauzeugen-Bereich Komponente für WeWeb
// Diese Komponente implementiert einen geschützten Bereich für Trauzeugen

import { ref, computed, onMounted, watch } from 'vue';
import { useAuth } from '../../composables/useAuth';

export default {
  name: 'TrauzeugenBereichUI',
  
  props: {
    weddingId: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    language: {
      type: String,
      default: 'de',
      validator: (value) => ['de', 'en', 'fr', 'es'].includes(value)
    }
  },
  
  setup(props, { emit }) {
    // Composables
    const { user, isAuthenticated } = useAuth();
    
    // Reaktive Daten
    const activeTab = ref('jga');
    const jgaTasks = ref([]);
    const jgaIdeas = ref([]);
    const jgaSchedule = ref([]);
    const polls = ref([]);
    const expenses = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    
    // Übersetzungen
    const translations = {
      de: {
        title: 'Trauzeugen-Bereich',
        description: 'Geschützter Bereich für die Planung von Überraschungen für das Brautpaar',
        jgaTab: 'JGA-Planung',
        pollsTab: 'Abstimmungen',
        expensesTab: 'Kostenaufteilung',
        tasksTitle: 'Aufgabenliste',
        ideasTitle: 'Ideenpool',
        scheduleTitle: 'Zeitplan',
        addTask: 'Aufgabe hinzufügen',
        addIdea: 'Idee hinzufügen',
        addEvent: 'Termin hinzufügen',
        createPoll: 'Abstimmung erstellen',
        addExpense: 'Ausgabe hinzufügen',
        unauthorized: 'Nur für Trauzeugen zugänglich',
        loading: 'Daten werden geladen...'
      },
      en: {
        title: 'Best Man/Maid of Honor Area',
        description: 'Protected area for planning surprises for the bride and groom',
        jgaTab: 'Bachelor/ette Party',
        pollsTab: 'Polls',
        expensesTab: 'Expense Sharing',
        tasksTitle: 'Task List',
        ideasTitle: 'Idea Pool',
        scheduleTitle: 'Schedule',
        addTask: 'Add Task',
        addIdea: 'Add Idea',
        addEvent: 'Add Event',
        createPoll: 'Create Poll',
        addExpense: 'Add Expense',
        unauthorized: 'Only accessible to best men/maids of honor',
        loading: 'Loading data...'
      },
      fr: {
        title: 'Espace Témoins',
        description: 'Espace protégé pour planifier des surprises pour les mariés',
        jgaTab: 'Enterrement de Vie',
        pollsTab: 'Sondages',
        expensesTab: 'Partage des Coûts',
        tasksTitle: 'Liste de Tâches',
        ideasTitle: 'Idées',
        scheduleTitle: 'Calendrier',
        addTask: 'Ajouter une Tâche',
        addIdea: 'Ajouter une Idée',
        addEvent: 'Ajouter un Événement',
        createPoll: 'Créer un Sondage',
        addExpense: 'Ajouter une Dépense',
        unauthorized: 'Accessible uniquement aux témoins',
        loading: 'Chargement des données...'
      },
      es: {
        title: 'Área de Testigos',
        description: 'Área protegida para planificar sorpresas para los novios',
        jgaTab: 'Despedida de Soltero/a',
        pollsTab: 'Encuestas',
        expensesTab: 'Reparto de Gastos',
        tasksTitle: 'Lista de Tareas',
        ideasTitle: 'Ideas',
        scheduleTitle: 'Calendario',
        addTask: 'Añadir Tarea',
        addIdea: 'Añadir Idea',
        addEvent: 'Añadir Evento',
        createPoll: 'Crear Encuesta',
        addExpense: 'Añadir Gasto',
        unauthorized: 'Accesible solo para testigos',
        loading: 'Cargando datos...'
      }
    };
    
    // Übersetzungsfunktion
    const t = (key) => {
      return translations[props.language][key] || key;
    };
    
    // Prüfen, ob der Benutzer ein Trauzeuge ist
    const isWitness = computed(() => {
      if (!user.value || !user.value.roles) return false;
      return user.value.roles.includes('witness');
    });
    
    // Beim Mounten der Komponente
    onMounted(async () => {
      if (isAuthenticated.value && isWitness.value) {
        await loadData();
      } else {
        isLoading.value = false;
      }
    });
    
    // Daten laden
    const loadData = async () => {
      isLoading.value = true;
      error.value = null;
      
      try {
        // Hier würden in einer echten Implementierung die Daten aus Supabase geladen werden
        // Für diese Demo verwenden wir Beispieldaten
        
        // JGA-Aufgaben laden
        jgaTasks.value = [
          { id: '1', title: 'Location buchen', completed: true, assignee: 'Max' },
          { id: '2', title: 'Einladungen versenden', completed: false, assignee: 'Lisa' },
          { id: '3', title: 'Aktivitäten planen', completed: false, assignee: 'Tom' }
        ];
        
        // JGA-Ideen laden
        jgaIdeas.value = [
          { id: '1', title: 'Escape Room', votes: 5, author: 'Max' },
          { id: '2', title: 'Weinprobe', votes: 3, author: 'Lisa' },
          { id: '3', title: 'Kochkurs', votes: 4, author: 'Tom' }
        ];
        
        // JGA-Zeitplan laden
        jgaSchedule.value = [
          { id: '1', title: 'Treffen am Bahnhof', date: '2025-05-15T10:00:00', location: 'Hauptbahnhof' },
          { id: '2', title: 'Aktivität 1', date: '2025-05-15T11:00:00', location: 'Geheim' },
          { id: '3', title: 'Mittagessen', date: '2025-05-15T13:00:00', location: 'Restaurant XYZ' }
        ];
        
        // Abstimmungen laden
        polls.value = [
          { 
            id: '1', 
            title: 'Datum für JGA', 
            options: [
              { id: '1', text: '15. Mai 2025', votes: 3 },
              { id: '2', text: '22. Mai 2025', votes: 1 },
              { id: '3', text: '29. Mai 2025', votes: 2 }
            ],
            voters: ['Max', 'Lisa', 'Tom', 'Anna', 'Peter', 'Julia']
          },
          { 
            id: '2', 
            title: 'Geschenkidee', 
            options: [
              { id: '1', text: 'Fotoalbum', votes: 2 },
              { id: '2', text: 'Reisegutschein', votes: 4 },
              { id: '3', text: 'Kochkurs', votes: 0 }
            ],
            voters: ['Max', 'Lisa', 'Tom', 'Anna', 'Peter', 'Julia']
          }
        ];
        
        // Ausgaben laden
        expenses.value = [
          { id: '1', title: 'Location', amount: 500, payer: 'Max', participants: ['Max', 'Lisa', 'Tom', 'Anna', 'Peter', 'Julia'] },
          { id: '2', title: 'Getränke', amount: 150, payer: 'Lisa', participants: ['Max', 'Lisa', 'Tom', 'Anna', 'Peter', 'Julia'] },
          { id: '3', title: 'Dekoration', amount: 80, payer: 'Tom', participants: ['Max', 'Lisa', 'Tom', 'Anna', 'Peter', 'Julia'] }
        ];
        
        isLoading.value = false;
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
        error.value = err.message;
        isLoading.value = false;
      }
    };
    
    // Tab wechseln
    const changeTab = (tab) => {
      activeTab.value = tab;
    };
    
    // Aufgabe hinzufügen
    const addTask = (task) => {
      jgaTasks.value.push({
        id: Date.now().toString(),
        title: task.title,
        completed: false,
        assignee: task.assignee || user.value.displayName
      });
    };
    
    // Idee hinzufügen
    const addIdea = (idea) => {
      jgaIdeas.value.push({
        id: Date.now().toString(),
        title: idea.title,
        votes: 0,
        author: user.value.displayName
      });
    };
    
    // Termin hinzufügen
    const addEvent = (event) => {
      jgaSchedule.value.push({
        id: Date.now().toString(),
        title: event.title,
        date: event.date,
        location: event.location
      });
    };
    
    // Abstimmung erstellen
    const createPoll = (poll) => {
      polls.value.push({
        id: Date.now().toString(),
        title: poll.title,
        options: poll.options.map((option, index) => ({
          id: (index + 1).toString(),
          text: option,
          votes: 0
        })),
        voters: []
      });
    };
    
    // Für Option abstimmen
    const voteForOption = (pollId, optionId) => {
      const poll = polls.value.find(p => p.id === pollId);
      if (!poll) return;
      
      // Prüfen, ob der Benutzer bereits abgestimmt hat
      const hasVoted = poll.voters.includes(user.value.displayName);
      if (hasVoted) {
        // Bestehende Stimme entfernen
        const oldVote = poll.options.find(o => o.voters && o.voters.includes(user.value.displayName));
        if (oldVote) {
          oldVote.votes--;
          oldVote.voters = oldVote.voters.filter(v => v !== user.value.displayName);
        }
        poll.voters = poll.voters.filter(v => v !== user.value.displayName);
      }
      
      // Neue Stimme hinzufügen
      const option = poll.options.find(o => o.id === optionId);
      if (option) {
        option.votes++;
        if (!option.voters) option.voters = [];
        option.voters.push(user.value.displayName);
        poll.voters.push(user.value.displayName);
      }
    };
    
    // Ausgabe hinzufügen
    const addExpense = (expense) => {
      expenses.value.push({
        id: Date.now().toString(),
        title: expense.title,
        amount: expense.amount,
        payer: user.value.displayName,
        participants: expense.participants
      });
    };
    
    // Berechnen, wie viel jeder Teilnehmer zahlen muss
    const calculateShares = computed(() => {
      const shares = {};
      
      expenses.value.forEach(expense => {
        const amountPerPerson = expense.amount / expense.participants.length;
        
        expense.participants.forEach(participant => {
          if (!shares[participant]) {
            shares[participant] = {
              toPay: 0,
              paid: 0,
              balance: 0
            };
          }
          
          // Wenn der Teilnehmer der Zahler ist, hat er bereits gezahlt
          if (participant === expense.payer) {
            shares[participant].paid += expense.amount;
          }
          
          // Jeder Teilnehmer muss seinen Anteil zahlen
          shares[participant].toPay += amountPerPerson;
        });
      });
      
      // Saldo berechnen
      Object.keys(shares).forEach(participant => {
        shares[participant].balance = shares[participant].paid - shares[participant].toPay;
      });
      
      return shares;
    });
    
    // CSS-Klassen basierend auf dem Theme
    const themeClasses = computed(() => {
      return {
        container: props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
        header: props.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800',
        tabs: props.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300',
        activeTab: props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
        inactiveTab: props.theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        card: props.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300',
        button: {
          primary: props.theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
          secondary: props.theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
          success: props.theme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white',
          danger: props.theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
        },
        input: props.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800',
        positive: props.theme === 'dark' ? 'text-green-400' : 'text-green-600',
        negative: props.theme === 'dark' ? 'text-red-400' : 'text-red-600'
      };
    });
    
    return {
      activeTab,
      jgaTasks,
      jgaIdeas,
      jgaSchedule,
      polls,
      expenses,
      isLoading,
      error,
      isAuthenticated,
      isWitness,
      changeTab,
      addTask,
      addIdea,
      addEvent,
      createPoll,
      voteForOption,
      addExpense,
      calculateShares,
      themeClasses,
      t
    };
  },
  
  // Template
  template: `
    <div class="trauzeugen-bereich p-4 rounded-lg" :class="themeClasses.container">
      <div class="header mb-6">
        <h2 class="text-2xl font-bold mb-2">{{ t('title') }}</h2>
        <p class="text-sm">{{ t('description') }}</p>
      </div>
      
      <!-- Nur für Trauzeugen zugänglich -->
      <div v-if="!isAuthenticated || !isWitness" class="unauthorized p-4 rounded-lg border" :class="themeClasses.card">
        <p class="text-center">{{ t('unauthorized') }}</p>
      </div>
      
      <!-- Ladeindikator -->
      <div v-else-if="isLoading" class="loading p-4 rounded-lg border" :class="themeClasses.card">
        <p class="text-center">{{ t('loading') }}</p>
      </div>
      
      <!-- Fehleranzeige -->
      <div v-else-if="error" class="error p-4 rounded-lg border bg-red-100 border-red-300">
        <p class="text-center text-red-600">{{ error }}</p>
      </div>
      
      <!-- Hauptinhalt -->
      <div v-else class="content">
        <!-- Tabs -->
        <div class="tabs flex border-b mb-4" :class="themeClasses.tabs">
          <button 
            @click="changeTab('jga')" 
            :class="[
              'px-4 py-2 font-medium',
              activeTab === 'jga' ? themeClasses.activeTab : themeClasses.inactiveTab
            ]"
          >
            {{ t('jgaTab') }}
          </button>
          <button 
            @click="changeTab('polls')" 
            :class="[
              'px-4 py-2 font-medium',
              activeTab === 'polls' ? themeClasses.activeTab : themeClasses.inactiveTab
            ]"
          >
            {{ t('pollsTab') }}
          </button>
          <button 
            @click="changeTab('expenses')" 
            :class="[
              'px-4 py-2 font-medium',
              activeTab === 'expenses' ? themeClasses.activeTab : themeClasses.inactiveTab
            ]"
          >
            {{ t('expensesTab') }}
          </button>
        </div>
        
        <!-- JGA-Planung Tab -->
        <div v-if="activeTab === 'jga'" class="jga-tab">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Aufgabenliste -->
            <div class="tasks p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ t('tasksTitle') }}</h3>
              <ul class="mb-4">
                <li v-for="task in jgaTasks" :key="task.id" class="flex items-center justify-between py-2 border-b" :class="props.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'">
                  <div class="flex items-center">
                    <input type="checkbox" :checked="task.completed" class="mr-2">
                    <span :class="{ 'line-through': task.completed }">{{ task.title }}</span>
                  </div>
                  <span class="text-sm text-gray-500">{{ task.assignee }}</span>
                </li>
              </ul>
              <button 
                :class="[themeClasses.button.primary, 'px-4 py-2 rounded text-sm font-medium w-full']"
              >
                {{ t('addTask') }}
              </button>
            </div>
            
            <!-- Ideenpool -->
            <div class="ideas p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ t('ideasTitle') }}</h3>
              <ul class="mb-4">
                <li v-for="idea in jgaIdeas" :key="idea.id" class="flex items-center justify-between py-2 border-b" :class="props.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'">
                  <div>
                    <span>{{ idea.title }}</span>
                    <span class="text-sm text-gray-500 block">{{ idea.author }}</span>
                  </div>
                  <div class="flex items-center">
                    <button class="text-gray-500 hover:text-gray-700 mr-2">👍</button>
                    <span class="text-sm">{{ idea.votes }}</span>
                  </div>
                </li>
              </ul>
              <button 
                :class="[themeClasses.button.primary, 'px-4 py-2 rounded text-sm font-medium w-full']"
              >
                {{ t('addIdea') }}
              </button>
            </div>
            
            <!-- Zeitplan -->
            <div class="schedule p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ t('scheduleTitle') }}</h3>
              <ul class="mb-4">
                <li v-for="event in jgaSchedule" :key="event.id" class="py-2 border-b" :class="props.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'">
                  <div class="font-medium">{{ event.title }}</div>
                  <div class="text-sm text-gray-500">
                    {{ new Date(event.date).toLocaleString() }}
                  </div>
                  <div class="text-sm text-gray-500">{{ event.location }}</div>
                </li>
              </ul>
              <button 
                :class="[themeClasses.button.primary, 'px-4 py-2 rounded text-sm font-medium w-full']"
              >
                {{ t('addEvent') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Abstimmungen Tab -->
        <div v-if="activeTab === 'polls'" class="polls-tab">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="poll in polls" :key="poll.id" class="poll p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ poll.title }}</h3>
              <ul class="mb-4">
                <li v-for="option in poll.options" :key="option.id" class="py-2 border-b" :class="props.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'">
                  <div class="flex items-center justify-between">
                    <span>{{ option.text }}</span>
                    <div class="flex items-center">
                      <button 
                        :class="[themeClasses.button.secondary, 'px-2 py-1 rounded text-xs font-medium mr-2']"
                        @click="voteForOption(poll.id, option.id)"
                      >
                        Vote
                      </button>
                      <span class="text-sm">{{ option.votes }}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="text-sm text-gray-500 mb-4">
                {{ poll.voters.length }} Personen haben abgestimmt
              </div>
            </div>
            
            <!-- Neue Abstimmung erstellen -->
            <div class="create-poll p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ t('createPoll') }}</h3>
              <button 
                :class="[themeClasses.button.primary, 'px-4 py-2 rounded text-sm font-medium w-full']"
              >
                {{ t('createPoll') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Kostenaufteilung Tab -->
        <div v-if="activeTab === 'expenses'" class="expenses-tab">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Ausgabenliste -->
            <div class="expenses-list p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ t('expensesTab') }}</h3>
              <ul class="mb-4">
                <li v-for="expense in expenses" :key="expense.id" class="py-2 border-b" :class="props.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="font-medium">{{ expense.title }}</span>
                      <span class="text-sm text-gray-500 block">{{ expense.payer }}</span>
                    </div>
                    <span class="font-medium">{{ expense.amount.toFixed(2) }} €</span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ expense.participants.length }} Personen
                  </div>
                </li>
              </ul>
              <button 
                :class="[themeClasses.button.primary, 'px-4 py-2 rounded text-sm font-medium w-full']"
              >
                {{ t('addExpense') }}
              </button>
            </div>
            
            <!-- Kostenaufteilung -->
            <div class="expense-sharing p-4 rounded-lg border" :class="themeClasses.card">
              <h3 class="text-lg font-medium mb-3">{{ t('expensesTab') }}</h3>
              <ul>
                <li v-for="(share, participant) in calculateShares" :key="participant" class="py-2 border-b" :class="props.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{{ participant }}</span>
                    <span 
                      :class="[
                        'font-medium',
                        share.balance > 0 ? themeClasses.positive : (share.balance < 0 ? themeClasses.negative : '')
                      ]"
                    >
                      {{ share.balance.toFixed(2) }} €
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    Bezahlt: {{ share.paid.toFixed(2) }} € | Anteil: {{ share.toPay.toFixed(2) }} €
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:weddingId: {
        type: 'text',
        label: 'Hochzeits-ID'
      },
      ui:theme: {
        type: 'select',
        label: 'Farbschema',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ]
      },
      ui:language: {
        type: 'select',
        label: 'Sprache',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' },
          { label: 'Französisch', value: 'fr' },
          { label: 'Spanisch', value: 'es' }
        ]
      }
    }
  },
  
  // WeWeb-Element-Konfiguration
  wwElement: {
    type: 'trauzeugen-bereich',
    uiSchema: {
      ui:weddingId: {
        type: 'text',
        label: 'Hochzeits-ID'
      },
      ui:theme: {
        type: 'select',
        label: 'Farbschema',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ]
      },
      ui:language: {
        type: 'select',
        label: 'Sprache',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' },
          { label: 'Französisch', value: 'fr' },
          { label: 'Spanisch', value: 'es' }
        ]
      }
    }
  },
  
  // WeWeb-Konfiguration
  wwConfig: {
    general: {
      label: 'Trauzeugen-Bereich',
      icon: 'user-group'
    },
    properties: {
      weddingId: {
        label: 'Hochzeits-ID',
        type: 'string',
        defaultValue: ''
      },
      theme: {
        label: 'Farbschema',
        type: 'select',
        options: [
          { label: 'Hell', value: 'light' },
          { label: 'Dunkel', value: 'dark' }
        ],
        defaultValue: 'light'
      },
      language: {
        label: 'Sprache',
        type: 'select',
        options: [
          { label: 'Deutsch', value: 'de' },
          { label: 'Englisch', value: 'en' },
          { label: 'Französisch', value: 'fr' },
          { label: 'Spanisch', value: 'es' }
        ],
        defaultValue: 'de'
      }
    }
  }
};
