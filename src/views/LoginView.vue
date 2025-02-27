<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login</h1>

      <MaterialInput
          v-model="email"
          label="Email"
          icon="envelope"
          :validator="validateEmail"
          @validate="handleValidation"
      />

      <MaterialInput
          v-model="password"
          label="Password"
          type="password"
          :is-password="true"
          required
      />

      <div class="button-container">
        <MaterialButton
            label="Login"
            @click="handleLogin"
            :disabled="!isFormValid"
        />
      </div>
      <div class="register-link">
        Non hai un account? <router-link to="/register">Registrati</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import MaterialInput from '../components/common/Input.vue';
import MaterialButton from '../components/common/Button.vue';

export default defineComponent({
  name: 'LoginPage',
  components: {
    MaterialInput,
    MaterialButton
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const formValid = ref(false);

    const validateEmail = (value: string): boolean | string => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        return 'Email è obbligatoria';
      }
      if (!emailRegex.test(value)) {
        return 'Inserisci un indirizzo email valido';
      }
      return true;
    };

    const handleValidation = (isValid: boolean) => {
      formValid.value = isValid;
    };

    const isFormValid = computed(() => {
      return email.value.length > 0 && password.value.length > 0 && formValid.value;
    });

    const handleLogin = () => {
      if (email.value && password.value) {
        console.log('Logging in with:', { email: email.value, password: password.value });
      }
    };

    return {
      email,
      password,
      isFormValid,
      validateEmail,
      handleValidation,
      handleLogin
    };
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--color-background-soft);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 8px;
  background-color: var(--color-background);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-heading);
  margin-bottom: 32px;
  text-align: center;
}

.button-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.register-link {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: var(--vt-c-indigo);
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link a:hover {
  color: #1e2f3d;
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .register-link a {
    color: var(--vt-c-white-soft);
  }

  .register-link a:hover {
    color: var(--vt-c-white);
  }
}
</style>
