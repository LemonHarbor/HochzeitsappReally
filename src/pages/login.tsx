import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "../components/ui/language-switcher";
import { useLanguage } from "../lib/language";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log("Login attempt with:", email);
      
      if (!email || !password) {
        setError(t("auth.enterBothFields"));
        return;
      }
      
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      // Redirect to dashboard on successful login
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };
  
  // For demo purposes, add a quick login function
  const handleDemoLogin = () => {
    setEmail("demo@lemonvows.de");
    setPassword("demo123");
  };
  
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
            <button 
              className="px-4 py-2 border-b-2 border-primary"
              onClick={() => console.log("Login tab clicked")}
            >
              {t("auth.login")}
            </button>
            <button 
              className="px-4 py-2"
              onClick={() => navigate("/register")}
            >
              {t("auth.register")}
            </button>
            <button 
              className="px-4 py-2"
              onClick={() => console.log("Guest access tab clicked")}
            >
              {t("auth.guestAccess")}
            </button>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">{t("auth.login")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("auth.enterGuestCode")}
          </p>
          
          {error && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                className="text-sm text-primary"
                onClick={() => alert("Password reset functionality will be implemented soon.")}
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-primary text-primary-foreground rounded-md"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="ml-2">{t("auth.signingIn")}</span>
                </div>
              ) : (
                t("auth.signIn")
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm">
              {t("auth.dontHaveAccount")} 
              <button 
                className="text-primary ml-1"
                onClick={() => navigate("/register")}
              >
                {t("auth.register")}
              </button>
            </p>
          </div>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              {t("auth.termsText")} 
              <a href="#" className="text-primary mx-1">{t("auth.termsLink")}</a> 
              {t("auth.andText")} 
              <a href="#" className="text-primary mx-1">{t("auth.privacyLink")}</a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4">
        <button 
          className="px-3 py-1 text-xs bg-muted rounded-md"
          onClick={handleDemoLogin}
        >
          {t("developer.toggleMode")}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
