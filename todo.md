# TypeScript-Fehler Behebung - Todo Liste

## 1. Import-Pfad-Fehler
- [x] Korrigiere Import-Pfade in src/data/checklistTemplates.ts (von "../../../src/" zu "@/")
- [x] Korrigiere Import-Pfade in src/hooks/useRealTimeRSVP.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtime.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeAppointments.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeBudget.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeContracts.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeGroups.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeMoodBoard.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeMusic.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimePhotos.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeRecommendations.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeRelationships.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeReviews.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeTimeline.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeUpdates.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeVendorAppointments.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeVendorExpenses.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeVendorPayments.ts
- [x] Korrigiere Import-Pfade in src/hooks/useRealtimeVendors.ts
- [x] Korrigiere Import-Pfade in src/hooks/useReviewVotes.ts

## 2. Fehlende Eigenschaften in Objekten
- [x] Füge fehlende Eigenschaften 'group_id' und 'group_name' zum Table-Interface hinzu
- [x] Korrigiere UserRole-Typ-Probleme in developer-mode.tsx
- [x] Überprüfe weitere fehlende Eigenschaften in anderen Komponenten

## 3. Doppelte Typdefinitionen
- [x] Erstelle zentrale Typdefinitionen in src/types/budget.ts
- [x] Ersetze lokale Expense-Interface in BudgetTracker.tsx
- [x] Ersetze lokale BudgetCategory-Interface in BudgetTracker.tsx
- [x] Importiere Expense-Typ in ExpenseForm.tsx
- [x] Ersetze lokale Typdefinitionen in BudgetDashboard.tsx
- [ ] Überprüfe fehlende UI-Komponenten-Importe

## 4. Falsche Eigenschaftstypen
- [x] Füge fehlende Badge-Varianten "success" und "warning" zur Badge-Komponente hinzu
- [x] Korrigiere Typzuweisungen in BudgetTracker.tsx mit Type Assertions
- [x] Ändere Expense zu Partial&lt;Expense&gt; in handleExpenseSubmit
- [x] Korrigiere Typisierung in VendorManager.tsx (Record&lt;string, string&gt; statt unknown as object)
- [ ] Überprüfe weitere Komponenten mit Typzuweisungsproblemen

## 5. Supabase API-Endpunkte
- [x] Ersetze 'any' Typen in guestsQuery mit korrekten Typen
- [x] Ersetze 'any' Typen in tablesQuery mit korrekten Typen
- [x] Ersetze 'any' Typen in seatsQuery mit korrekten Typen
- [ ] Überprüfe weitere Supabase-Abfragen auf 'any' Typen

## 5. Fehlende Eigenschaften in Objekten
- [ ] Identifiziere und behebe fehlende Eigenschaften in Objekten

## 6. Doppelte Typdefinitionen
- [ ] Identifiziere und behebe doppelte Typdefinitionen

## 7. Falsche Eigenschaftstypen
- [ ] Identifiziere und behebe falsche Eigenschaftstypen

## 8. Supabase API-Endpunkte
- [ ] Überprüfe und korrigiere fehlende API-Endpunkte in Supabase

## 9. Testen und Deployment
- [ ] Führe TypeScript-Compiler-Check durch
- [ ] Teste die Anwendung lokal
- [ ] Committe und pushe Änderungen ins GitHub-Repository
- [ ] Überprüfe das Deployment auf Vercel
