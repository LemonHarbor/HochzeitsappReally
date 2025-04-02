import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useLanguage } from '../../composables/useLanguage';

export default defineComponent({
  name: 'LoginPage',
  
  props: {
    register: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props) {
    const { t } = useLanguage();
    const { signIn, signUp } = useAuth();
    const router = useRouter();
    const route = useRoute();
    
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const loading = ref(false);
    const isRegister = ref(props.register);
    
    // Check if register parameter is in the URL
    onMounted(() => {
      if (route.query.register === 'true') {
        isRegister.value = true;
      }
    });
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      error.value = null;
      loading.value = true;
      
      try {
        console.log("Authentication attempt with:", email.value);
        
        if (!email.value || !password.value) {
          error.value = t("auth.enterBothFields") || "Bitte geben Sie E-Mail und Passwort ein";
          loading.value = false;
          return;
        }
        
        if (isRegister.value) {
          const { error: signUpError } = await signUp(email.value, password.value);
          if (signUpError) throw signUpError;
          // Show success message and redirect to login
          alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.');
          router.push('/login');
        } else {
          const { error: signInError } = await signIn(email.value, password.value);
          if (signInError) throw signInError;
          // Redirect to dashboard on successful login
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        error.value = err.message || t("auth.loginFailed") || "Anmeldung fehlgeschlagen";
      } finally {
        loading.value = false;
      }
    };
    
    // For demo purposes, add a quick login function
    const handleDemoLogin = () => {
      email.value = "demo@lemonvows.de";
      password.value = "demo123";
    };
    
    const toggleRegister = () => {
      isRegister.value = !isRegister.value;
    };
    
    return {
      email,
      password,
      error,
      loading,
      isRegister,
      handleSubmit,
      handleDemoLogin,
      toggleRegister,
      t
    };
  },
  
  // WeWeb-spezifische Konfiguration
  wwElement: {
    type: 'login-page',
    uiSchema: {
      ui:register: {
        type: 'toggle',
        label: 'Registrierungsmodus'
      }
    }
  },
  
  wwConfig: {
    general: {
      label: 'Login-Seite',
      icon: 'user'
    },
    properties: {
      register: {
        label: 'Registrierungsmodus',
        type: 'boolean',
        defaultValue: false
      }
    }
  }
});
