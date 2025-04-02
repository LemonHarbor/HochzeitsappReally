import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../lib/language';

interface LoginPageProps {
  register?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ register = false }) => {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if register parameter is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setIsRegister(true);
    }
  }, [location]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(register);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log("Authentication attempt with:", email);
      
      if (!email || !password) {
        setError(t("auth.enterBothFields") || "Bitte geben Sie E-Mail und Passwort ein");
        setLoading(false);
        return;
      }
      
      if (isRegister) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        // Show success message and redirect to login
        alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.');
        navigate('/login');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        // Redirect to dashboard on successful login
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || t("auth.loginFailed") || "Anmeldung fehlgeschlagen");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegister ? t("auth.register") || "Registrieren" : t("auth.login") || "Anmelden"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister ? t("auth.createAccount") || "Erstellen Sie Ihr Konto" : t("auth.signInToAccount") || "Melden Sie sich bei Ihrem Konto an"}
          </p>
        </div>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">{t("auth.email") || "E-Mail-Adresse"}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t("auth.email") || "E-Mail-Adresse"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t("auth.password") || "Passwort"}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t("auth.password") || "Passwort"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="text-sm text-primary"
              onClick={() => alert(t("auth.passwordResetSoon") || "Password-Reset-Funktionalität wird bald implementiert.")}
            >
              {t("auth.forgotPassword") || "Passwort vergessen?"}
            </button>
          </div>
          
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="ml-2">{t("auth.signingIn") || "Anmelden..."}</span>
              </div>
            ) : (
              isRegister ? (t("auth.register") || "Registrieren") : (t("auth.signIn") || "Anmelden")
            )}
          </button>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {isRegister ? (
                <button 
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {t("auth.alreadyRegistered") || "Bereits registriert? Anmelden"}
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {t("auth.dontHaveAccount") || "Noch kein Konto? Registrieren"}
                </button>
              )}
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="font-medium text-primary hover:text-primary-dark"
              >
                {t("auth.demoLogin") || "Demo-Login"}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← {t("common.backToHome") || "Zurück zur Startseite"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
