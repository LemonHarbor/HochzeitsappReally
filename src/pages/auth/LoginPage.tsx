import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  register?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ register = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (register) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        // Show success message and redirect to login
        alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.');
        navigate('/login');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, add a quick login function
  const handleDemoLogin = () => {
    setEmail('demo@lemonvows.de');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {register ? 'Registrieren' : 'Anmelden'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {register ? 'Erstellen Sie Ihr Konto' : 'Melden Sie sich bei Ihrem Konto an'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">E-Mail-Adresse</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Passwort</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={register ? 'new-password' : 'current-password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {register ? 'Registrieren' : 'Anmelden'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              {register ? (
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                  Bereits registriert? Anmelden
                </Link>
              ) : (
                <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                  Noch kein Konto? Registrieren
                </Link>
              )}
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="font-medium text-primary hover:text-primary-dark"
              >
                Demo-Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
