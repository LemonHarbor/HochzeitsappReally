import React from "react";
import { LanguageSwitcher } from "../components/ui/language-switcher";
import { useLanguage } from "../lib/language";

export function LoginPage() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("app.title")}</h1>
          <p className="text-muted-foreground">{t("app.description")}</p>
        </div>
        
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <div className="flex border-b mb-4">
            <button className="px-4 py-2 border-b-2 border-primary">{t("auth.login")}</button>
            <button className="px-4 py-2">{t("auth.register")}</button>
            <button className="px-4 py-2">{t("auth.guestAccess")}</button>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">{t("auth.login")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("auth.enterGuestCode")}
          </p>
          
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary">
                {t("auth.forgotPassword")}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-primary text-primary-foreground rounded-md"
            >
              {t("auth.signIn")}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm">
              {t("auth.dontHaveAccount")} <button className="text-primary">{t("auth.register")}</button>
            </p>
          </div>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              {t("auth.termsText")} <a href="#" className="text-primary">{t("auth.termsLink")}</a> {t("auth.andText")} <a href="#" className="text-primary">{t("auth.privacyLink")}</a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4">
        <button className="px-3 py-1 text-xs bg-muted rounded-md">
          {t("developer.toggleMode")}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
