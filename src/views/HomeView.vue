<template>
  This is home page
  <ModalNotification
      message="Operazione completata con successo!"
      :isError="false"
      :timeout="5000"
      @close=""
  />

</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'

import ModalNotification from "@/components/common/Modal.vue";

export default {
  components: { ModalNotification: ModalNotification },
  setup() {
    const username = ref('');
    const router = useRouter()
    const authStore = useAuthStore()

    onMounted(() => {
      authStore.initializeStore();
      if (!authStore.isAuthenticated) {
        router.push('/login');
      }
    });

    const validateUsername = (value: string): string | null => {
      if (!value) return 'Il campo non può essere vuoto.';
      if (value.length < 3) return 'Deve avere almeno 3 caratteri.';
      return null;
    };

    const updateUsername = (newValue: string) => {
      username.value = newValue;
    };

    return {
      username,
      validateUsername,
      updateUsername,
    };
  },
};
</script>