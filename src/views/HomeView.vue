<template>
  This is home page
</template>

<script lang="ts">
import { ref } from 'vue';

import MaterialInput from '../components/common/Input.vue';

export default {
  components: { MaterialInput },
  setup() {
    const username = ref('');

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