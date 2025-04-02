<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center">
        <h2 class="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          {{ isRegister ? (t("auth.register") || "Registrieren") : (t("auth.login") || "Anmelden") }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isRegister ? (t("auth.createAccount") || "Erstellen Sie Ihr Konto") : (t("auth.signInToAccount") || "Melden Sie sich bei Ihrem Konto an") }}
        </p>
      </div>
      
      <div v-if="error" class="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
        {{ error }}
      </div>
      
      <form class="mt-6 space-y-5" @submit="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">
              {{ t("auth.email") || "E-Mail-Adresse" }}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 text-base"
              :placeholder="t('auth.emailPlaceholder') || 'ihre@email.de'"
              v-model="email"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              {{ t("auth.password") || "Passwort" }}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              :autocomplete="isRegister ? 'new-password' : 'current-password'"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 text-base"
              :placeholder="t('auth.passwordPlaceholder') || '••••••••'"
              v-model="password"
            />
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="button" 
            class="text-sm text-primary"
            @click="alert(t('auth.passwordResetSoon') || 'Password-Reset-Funktionalität wird bald implementiert.')"
          >
            {{ t("auth.forgotPassword") || "Passwort vergessen?" }}
          </button>
        </div>
        
        <button
          type="submit"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          :disabled="loading"
        >
          <div v-if="loading" class="flex items-center justify-center">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <span class="ml-2">{{ t("auth.signingIn") || "Anmelden..." }}</span>
          </div>
          <span v-else>
            {{ isRegister ? (t("auth.register") || "Registrieren") : (t("auth.signIn") || "Anmelden") }}
          </span>
        </button>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm w-full sm:w-auto">
            <button 
              type="button"
              @click="toggleRegister"
              class="w-full sm:w-auto font-medium text-primary hover:text-primary-dark py-2 px-3 border border-transparent rounded-md"
            >
              {{ isRegister 
                ? (t("auth.alreadyRegistered") || "Bereits registriert? Anmelden") 
                : (t("auth.dontHaveAccount") || "Noch kein Konto? Registrieren") 
              }}
            </button>
          </div>
          <div class="text-sm w-full sm:w-auto">
            <button
              type="button"
              @click="handleDemoLogin"
              class="w-full sm:w-auto font-medium text-primary hover:text-primary-dark py-2 px-3 border border-transparent rounded-md"
            >
              {{ t("auth.demoLogin") || "Demo-Login" }}
            </button>
          </div>
        </div>
      </form>
      
      <div class="mt-6">
        <router-link to="/" class="text-sm text-gray-600 hover:text-gray-900">
          ← {{ t("common.backToHome") || "Zurück zur Startseite" }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script src="./LoginPage.ts"></script>

<style scoped>
@media (max-width: 640px) {
  .min-h-screen {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  form {
    margin-top: 1rem;
  }
  
  button[type="submit"] {
    margin-top: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
</style>
