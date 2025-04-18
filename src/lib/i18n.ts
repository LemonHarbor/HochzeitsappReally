// Language translations for the application

export type Language = "en" | "de";

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    "app.title": "LemonVows by LemonHarbor",
    "app.description":
      "Plan your perfect wedding day with our comprehensive tools",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.guestAccess": "Guest Access",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot password?",
    "auth.signIn": "Sign In",
    "auth.createAccount": "Create an account",
    "auth.registerDescription": "Register to plan your perfect wedding day",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.guestAccessDescription":
      "Enter your invitation code to view details and RSVP",
    "auth.invitationCode": "Invitation Code",
    "auth.accessInvitation": "Access Invitation",
    "auth.termsText": "By using this service, you agree to our",
    "auth.termsLink": "Terms of Service",
    "auth.andText": "and",
    "auth.privacyLink": "Privacy Policy",
    "auth.enterGuestCode": "Enter the access code provided by the couple",

    // Dashboard
    "dashboard.title": "Wedding Dashboard",
    "dashboard.totalGuests": "Total Guests",
    "dashboard.confirmedGuests": "Confirmed Guests",
    "dashboard.pendingRsvps": "Pending RSVPs",
    "dashboard.daysUntilWedding": "Days Until Wedding",
    "dashboard.tablesPlanned": "Tables Planned",
    "dashboard.giftsReceived": "Gifts Received",
    "dashboard.quickActions": "Quick Actions",

    // Guest Management
    "guests.title": "Guest Management",
    "guests.addGuest": "Add Guest",
    "guests.editGuest": "Edit Guest",
    "guests.firstName": "First Name",
    "guests.lastName": "Last Name",
    "guests.email": "Email",
    "guests.phone": "Phone Number",
    "guests.category": "Category",
    "guests.rsvpStatus": "RSVP Status",
    "guests.confirmed": "Confirmed",
    "guests.pending": "Pending",
    "guests.declined": "Declined",
    "guests.dietaryRestrictions": "Dietary Restrictions",
    "guests.plusOne": "Plus One",
    "guests.notes": "Notes",
    "guests.search": "Search guests...",
    "guests.noGuests": "No guests found matching your criteria",
    "guests.family": "Family",
    "guests.friends": "Friends",
    "guests.colleagues": "Colleagues",
    "guests.other": "Other",
    "guests.sendInvites": "Send Invites",

    // Table Planner
    "tables.title": "Table Planner",
    "tables.addTable": "Add Table",
    "tables.editTable": "Edit Table",
    "tables.tableName": "Table Name",
    "tables.shape": "Table Shape",
    "tables.capacity": "Capacity",
    "tables.round": "Round",
    "tables.rectangle": "Rectangle",
    "tables.custom": "Custom",
    "tables.location": "Location",
    "tables.saveArrangement": "Save Arrangement",
    "tables.clearAll": "Clear All",
    "tables.aiOptimize": "AI Optimize Seating",
    "tables.noTables": "No tables added yet",
    "tables.addFirstTable": "Add your first table",
    "tables.seats": "seats",

    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.security": "Security",
    "settings.permissions": "Permissions",
    "settings.notifications": "Notifications",
    "settings.manageAccount": "Manage your account settings and preferences",
    "settings.themes": "Themes",
    "settings.switchCurrency": "Switch Currency",
    "settings.selectCurrency": "Select Currency",
    "settings.currency": "Currency",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.guestManagement": "Guest Management",
    "nav.tablePlanner": "Table Planner",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.guestArea": "Guest Area",
    "nav.photoUpload": "Photo Upload",
    "nav.musicWishlist": "Music Wishlist",
    "nav.timeline": "Timeline",
    "nav.vendors": "Vendors",

    // Actions
    "actions.save": "Save",
    "actions.cancel": "Cancel",
    "actions.delete": "Delete",
    "actions.edit": "Edit",
    "actions.add": "Add",
    "actions.update": "Update",
    "actions.search": "Search",
    "actions.filter": "Filter",
    "actions.clear": "Clear",
    "actions.confirm": "Confirm",
    "actions.send": "Send",
    "actions.export": "Export",
    "actions.import": "Import",
    "actions.view": "View",
    "actions.zoomIn": "Zoom in",
    "actions.zoomOut": "Zoom out",
    "actions.rotate": "Rotate table",
    "actions.deleteTable": "Delete table",
    "actions.any": "Any",
    "actions.moreActions": "More Actions",
    "actions.shareWithPartner": "Share with Partner",
    "actions.exportData": "Export Data",
    "actions.managePermissions": "Manage Permissions",

    // Misc
    "misc.loading": "Loading...",
    "misc.saving": "Saving...",
    "misc.processing": "Processing...",
    "misc.error": "Error",
    "misc.success": "Success",
    "misc.warning": "Warning",
    "misc.info": "Information",
    "misc.daysUntilWedding": "{days} days until wedding",
    "misc.weddingToday": "Today is the big day!",
    "misc.weddingCompleted": "Wedding completed",

    // Guest Area
    "guestArea.title": "Guest Area",
    "guestArea.welcome": "Welcome to our wedding!",
    "guestArea.rsvp": "RSVP",
    "guestArea.photoUpload": "Upload Photos",
    "guestArea.musicWishlist": "Music Wishlist",
    "guestArea.timeline": "Event Timeline",
    "guestArea.addPhoto": "Add Photo",
    "guestArea.addSong": "Add Song",
    "guestArea.uploadInstructions": "Drag and drop photos or click to browse",
    "guestArea.songTitle": "Song Title",
    "guestArea.artist": "Artist",
    "guestArea.yourPhotos": "Your Photos",
    "guestArea.yourWishes": "Your Music Wishes",
    "guestArea.timelineEvents": "Wedding Events",

    // Timeline
    "timeline.title": "Wedding Timeline",
    "timeline.description":
      "Plan your perfect wedding day with our interactive timeline",
    "timeline.addEvent": "Add Event",
    "timeline.editEvent": "Edit Event",
    "timeline.eventTitle": "Event Title",
    "timeline.eventTime": "Event Time",
    "timeline.eventDescription": "Event Description",
    "timeline.eventLocation": "Event Location",
    "timeline.selectDate": "Select Wedding Date",
    "timeline.selectDatePrompt": "Select your wedding date to get started",
    "timeline.selectDateDescription":
      "We'll create a personalized timeline based on your wedding date",
    "timeline.weddingDate": "Wedding Date",
    "timeline.monthsUntilWedding": "months until your wedding",
    "timeline.alreadyCompleted": "What have you already completed",
    "timeline.progress": "Planning Progress",
    "timeline.generating": "Generating your personalized timeline...",
    "timeline.generated": "Timeline Generated",
    "timeline.saved": "Timeline Saved",
    "timeline.savedDescription":
      "Your wedding timeline has been saved successfully",
    "timeline.generationError":
      "There was an error generating your timeline. Please try again.",
    "timeline.longTermPlanning":
      "You have plenty of time for planning. We've created a comprehensive timeline for you.",
    "timeline.mediumTermPlanning":
      "You have a good amount of time for planning. We've focused on the most important tasks.",
    "timeline.shortTermPlanning":
      "Your wedding is coming up soon! We've prioritized the essential tasks for you.",
    "timeline.tasks.venue": "Venue booked",
    "timeline.tasks.dateSelected": "Wedding date selected",
    "timeline.tasks.budgetSet": "Budget established",
    "timeline.tasks.guestListStarted": "Guest list started",
    "timeline.tasks.photographerBooked": "Photographer booked",
    "timeline.tasks.cateringBooked": "Catering arranged",
    
    // Developer
    "developer.toggleMode": "Toggle Developer Mode",
  },
  de: {
    // Common
    "app.title": "LemonVows by LemonHarbor",
    "app.description":
      "Planen Sie Ihren perfekten Hochzeitstag mit unseren umfassenden Tools",

    // Auth
    "auth.login": "Anmelden",
    "auth.register": "Registrieren",
    "auth.guestAccess": "Gastzugang",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.signIn": "Einloggen",
    "auth.createAccount": "Konto erstellen",
    "auth.registerDescription":
      "Registrieren Sie sich, um Ihren perfekten Hochzeitstag zu planen",
    "auth.alreadyHaveAccount": "Haben Sie bereits ein Konto?",
    "auth.dontHaveAccount": "Haben Sie noch kein Konto?",
    "auth.guestAccessDescription":
      "Geben Sie Ihren Einladungscode ein, um Details anzuzeigen und zu antworten",
    "auth.invitationCode": "Einladungscode",
    "auth.accessInvitation": "Einladung aufrufen",
    "auth.termsText": "Durch die Nutzung dieses Dienstes stimmen Sie unseren",
    "auth.termsLink": "Nutzungsbedingungen",
    "auth.andText": "und",
    "auth.privacyLink": "Datenschutzrichtlinien",
    "auth.enterGuestCode": "Geben Sie den vom Paar bereitgestellten Zugangscode ein",

    // Dashboard
    "dashboard.title": "Hochzeits-Dashboard",
    "dashboard.totalGuests": "Gesamtzahl der Gäste",
    "dashboard.confirmedGuests": "Bestätigte Gäste",
    "dashboard.pendingRsvps": "Ausstehende Antworten",
    "dashboard.daysUntilWedding": "Tage bis zur Hochzeit",
    "dashboard.tablesPlanned": "Geplante Tische",
    "dashboard.giftsReceived": "Erhaltene Geschenke",
    "dashboard.quickActions": "Schnellaktionen",

    // Guest Management
    "guests.title": "Gästeverwaltung",
    "guests.addGuest": "Gast hinzufügen",
    "guests.editGuest": "Gast bearbeiten",
    "guests.firstName": "Vorname",
    "guests.lastName": "Nachname",
    "guests.email": "E-Mail",
    "guests.phone": "Telefonnummer",
    "guests.category": "Kategorie",
    "guests.rsvpStatus": "RSVP-Status",
    "guests.confirmed": "Bestätigt",
    "guests.pending": "Ausstehend",
    "guests.declined": "Abgelehnt",
    "guests.dietaryRestrictions": "Ernährungseinschränkungen",
    "guests.plusOne": "Begleitung",
    "guests.notes": "Notizen",
    "guests.search": "Gäste suchen...",
    "guests.noGuests": "Keine Gäste gefunden, die Ihren Kriterien entsprechen",
    "guests.family": "Familie",
    "guests.friends": "Freunde",
    "guests.colleagues": "Kollegen",
    "guests.other": "Andere",
    "guests.sendInvites": "Einladungen senden",
    
    // Developer
    "developer.toggleMode": "Entwicklermodus umschalten",
  }
};
