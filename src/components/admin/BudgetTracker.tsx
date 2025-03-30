import React from "react";
import { useLanguage } from "../../../../src/lib/language";

export function BudgetTracker() {
  const { t } = useLanguage();
  
  // Dummy budget data for demonstration
  const totalBudget = 15000;
  const spent = 8750;
  const remaining = totalBudget - spent;
  const percentSpent = Math.round((spent / totalBudget) * 100);
  
  // Dummy expense data
  const expenses = [
    { id: 1, category: "venue", amount: 5000, date: "2025-06-15", vendor: "Schloss Schönbrunn", notes: "Anzahlung", paid: true },
    { id: 2, category: "catering", amount: 2500, date: "2025-06-15", vendor: "Gourmet Catering", notes: "Anzahlung für 80 Personen", paid: true },
    { id: 3, category: "photography", amount: 1250, date: "2025-07-01", vendor: "Foto Schmidt", notes: "Anzahlung", paid: true },
    { id: 4, category: "flowers", amount: 0, date: "2025-07-15", vendor: "Blumen Meyer", notes: "Noch nicht bezahlt", paid: false },
  ];
  
  // Category options
  const categories = [
    "venue", "catering", "photography", "videography", "music", 
    "flowers", "attire", "rings", "invitations", "transportation", 
    "accommodation", "decorations", "gifts", "other"
  ];
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("budget.title")}</h1>
        <p className="text-muted-foreground">{t("admin.sections.budget.description")}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{t("budget.totalBudget")}</h3>
          <p className="text-4xl font-bold">{totalBudget} €</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{t("budget.spent")}</h3>
          <p className="text-4xl font-bold">{spent} €</p>
          <p className="text-sm text-muted-foreground">{percentSpent}% {t("budget.spent").toLowerCase()}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{t("budget.remaining")}</h3>
          <p className="text-4xl font-bold">{remaining} €</p>
          <p className="text-sm text-muted-foreground">{100 - percentSpent}% {t("budget.remaining").toLowerCase()}</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow mb-8 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("admin.budgetBreakdown")}</h2>
          <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
            <span className="mr-2">+</span> {t("budget.addExpense")}
          </button>
        </div>
        
        <div className="p-4">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-primary h-4 rounded-full" 
              style={{ width: `${percentSpent}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">{t("admin.topExpenses")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{t("budget.categories.venue")}</span>
                  <span className="font-medium">5000 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("budget.categories.catering")}</span>
                  <span className="font-medium">2500 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("budget.categories.photography")}</span>
                  <span className="font-medium">1250 €</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">{t("admin.upcomingPayments")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{t("budget.categories.flowers")}</span>
                  <span className="font-medium">800 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("budget.categories.music")}</span>
                  <span className="font-medium">1200 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("budget.categories.transportation")}</span>
                  <span className="font-medium">500 €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{t("admin.expenseList")}</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">{t("budget.category")}</th>
                <th className="px-4 py-3 text-left">{t("budget.amount")}</th>
                <th className="px-4 py-3 text-left">{t("budget.date")}</th>
                <th className="px-4 py-3 text-left">{t("budget.vendor")}</th>
                <th className="px-4 py-3 text-left">{t("budget.notes")}</th>
                <th className="px-4 py-3 text-left">{t("budget.paid")}</th>
                <th className="px-4 py-3 text-left">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{t(`budget.categories.${expense.category}`)}</td>
                  <td className="px-4 py-3">{expense.amount} €</td>
                  <td className="px-4 py-3">{expense.date}</td>
                  <td className="px-4 py-3">{expense.vendor}</td>
                  <td className="px-4 py-3">{expense.notes}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {expense.paid ? t("common.yes") : t("common.no")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {t("common.edit")}
                      </button>
                      <button className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BudgetTracker;
