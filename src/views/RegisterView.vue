<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Registrati</h1>

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

      <MaterialInput
          v-model="confirmPassword"
          label="Conferma Password"
          type="password"
          :is-password="true"
          :validator="validateConfirmPassword"
          @validate="handleConfirmPasswordValidation"
          required
      />

      <div class="button-container">
        <MaterialButton
            label="Registrati"
            @click="handleRegister"
            :disabled="!isFormValid"
        />
      </div>
      <div class="register-link">
        Hai già un account? <router-link to="/login">Login</router-link>
      </div>
    </div>
    <ModalNotification
        v-if="showModal"
        :message="modalMessage"
        :is-error="isError"
        :timeout="3000"
        @close="handleModalClose"
    />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import MaterialInput from '../components/common/Input.vue';
import MaterialButton from '../components/common/Button.vue';
import ModalNotification from '../components/common/Modal.vue';
import { url, getHeaders } from '../fetch_conf';
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'RegisterView',
  components: {
    MaterialInput,
    MaterialButton,
    ModalNotification
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const formValid = ref(false);
    const confirmPassword = ref('');
    const confirmPasswordValid = ref(false);

    const showModal = ref(false);
    const modalMessage = ref('');
    const isError = ref(false);
    const router = useRouter();

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

    const validateConfirmPassword = (value: string): boolean | string => {
      if (!value) {
        return 'La conferma della password è obbligatoria';
      }
      if (value !== password.value) {
        return 'Le password non coincidono';
      }
      return true;
    };

    const handleConfirmPasswordValidation = (isValid: boolean) => {
      confirmPasswordValid.value = isValid;
    };


    const handleValidation = (isValid: boolean) => {
      formValid.value = isValid;
    };

    const isFormValid = computed(() => {
      return email.value.length > 0 &&
          password.value.length > 0 &&
          confirmPassword.value.length > 0 &&
          formValid.value &&
          confirmPasswordValid.value;
    });

    const handleRegister = async() => {
      if (email.value && password.value) {
        try {
          const response = await fetch(`${url}send-verify-email`, {
            method: 'POST',
            headers: getHeaders(""),
            body: JSON.stringify({
              email: email.value,
              password: password.value
            })
          });
          const data = await response.json();
          if (!response.ok) {
            console.error('Errore:', data.error || 'Errore non specificato');
            modalMessage.value = data.error || 'Si è verificato un errore durante l\'invio dell\'email di verifica.';
            isError.value = true;
            showModal.value = true;
            return;
          }
          console.log('Risposta dal server:', data);
          modalMessage.value = 'Email di verifica inviata con successo!';
          isError.value = false;
          showModal.value = true;

        } catch (error) {
          console.error('Errore:', error);
          modalMessage.value = 'Si è verificato un errore durante l\'invio dell\'email di verifica.';
          isError.value = true;
          showModal.value = true;
        }
      }
    };

    const handleModalClose = () => {
      showModal.value = false;
      if(isError.value) {
        email.value = '';
        password.value = '';
        confirmPassword.value = '';
      }else {
        router.push('/login');
      }
    };

    return {
      email,
      password,
      isFormValid,
      validateEmail,
      handleValidation,
      handleRegister,
      confirmPassword,
      validateConfirmPassword,
      handleConfirmPasswordValidation,
      showModal,
      modalMessage,
      isError,
      handleModalClose,
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
