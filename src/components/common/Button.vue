<template>
  <button
      class="material-button"
      :class="{
      'disabled': isDisabled,
      'icon-button': !!icon && !label
    }"
      :disabled="isDisabled"
      @click="handleClick"
  >
    <font-awesome-icon v-if="icon" :icon="icon" class="button-icon" />
    <span v-if="label" class="button-text">{{ label }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'MaterialButton',
  components: {
    FontAwesomeIcon
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: [String, Array, Object],
      default: null
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: null
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const isDisabled = computed(() => {
      return props.disabled || !props.onClick;
    });

    const handleClick = (event: MouseEvent) => {
      if (isDisabled.value) return;
      emit('click', event);
    };

    return {
      isDisabled,
      handleClick
    };
  }
});
</script>

<style scoped>
.material-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  outline: none;
  background-color: var(--vt-c-indigo);
  color: white;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  overflow: hidden;
}

.material-button:hover {
  background-color: #1e2f3d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.material-button:active {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}

.material-button.disabled {
  background-color: var(--vt-c-divider-light-1);
  color: var(--vt-c-text-light-2);
  box-shadow: none;
  cursor: not-allowed;
}

.button-icon {
  margin-right: 8px;
}

.button-icon:only-child {
  margin-right: 0;
}

.icon-button {
  min-width: 36px;
  width: 36px;
  border-radius: 50%;
  padding: 0;
}

@media (prefers-color-scheme: dark) {
  .material-button {
    background-color: var(--vt-c-white);
    color: var(--vt-c-black);
  }

  .material-button:hover {
    background-color: #e0e0e0;
  }

  .material-button.disabled {
    background-color: var(--vt-c-divider-dark-1);
    color: var(--vt-c-text-dark-2);
  }
}
</style>