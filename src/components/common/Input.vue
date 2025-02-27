<template>
  <div
      class="material-input-container"
      :class="{ 'disabled': disabled }"
  >
    <div
        class="input-wrapper"
        :class="{
        'focused': isFocused,
        'invalid': !isValid
      }"
    >
      <div v-if="icon" class="input-icon" :class="{ 'focused': isFocused }">
        <font-awesome-icon :icon="icon" />
      </div>

      <div class="input-field">
        <input
            ref="inputRef"
            :type="actualInputType"
            :value="modelValue"
            :name="name"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            :disabled="disabled"
            :required="required"
            :autocomplete="autoComplete"
        />

        <label :class="{ 'active': isFocused || modelValue }">{{ label }}</label>

        <div class="input-line"></div>
      </div>

      <button
          v-if="isPassword"
          type="button"
          class="toggle-password"
          :class="{ 'focused': isFocused }"
          @click="togglePasswordVisibility"
          tabindex="-1"
      >
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
      </button>
    </div>

    <div v-if="!isValid && errorMsg" class="error-message">{{ errorMsg }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, type PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type ValidatorFunction = (value: string) => boolean | string;

export default defineComponent({
  name: 'MaterialInput',
  components: {
    FontAwesomeIcon
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    icon: {
      type: [String, Array, Object],
      default: null
    },
    validator: {
      type: Function as PropType<ValidatorFunction>,
      default: null
    },
    isPassword: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: 'Please enter a valid value'
    },
    autoComplete: {
      type: String,
      default: 'off'
    }
  },
  emits: ['update:modelValue', 'change', 'validate'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);
    const isFocused = ref(false);
    const isValid = ref(true);
    const errorMsg = ref('');
    const showPassword = ref(false);

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const newValue = target.value;

      emit('update:modelValue', newValue);
      emit('change', newValue);
    };

    const handleFocus = () => {
      isFocused.value = true;
    };

    const handleBlur = () => {
      isFocused.value = props.modelValue !== '';
      validateInput(props.modelValue);
    };

    const validateInput = (val: string) => {
      if (props.validator) {
        const validationResult = props.validator(val);
        if (typeof validationResult === 'boolean') {
          isValid.value = validationResult;
          errorMsg.value = validationResult ? '' : props.errorMessage;
        } else {
          {
            isValid.value = false;
            errorMsg.value = validationResult;
          }
        }
      } else if (props.required && val.trim() === '') {
        isValid.value = false;
        errorMsg.value = 'This field is required';
      } else {
        isValid.value = true;
        errorMsg.value = '';
      }

      emit('validate', isValid.value);
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const actualInputType = computed(() => {
      if (!props.isPassword) return props.type;
      return showPassword.value ? 'text' : 'password';
    });

    watch(() => props.modelValue, (newVal) => {
      if (isFocused.value === false) {
        isFocused.value = newVal !== '';
      }
    });

    return {
      inputRef,
      isFocused,
      isValid,
      errorMsg,
      showPassword,
      handleInput,
      handleFocus,
      handleBlur,
      validateInput,
      togglePasswordVisibility,
      actualInputType
    };
  }
});
</script>

<style scoped>
.material-input-container {
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background-color: transparent;
  border-radius: 4px 4px 0 0;
}

.input-icon {
  padding: 0 12px;
  color: var(--vt-c-text-light-2);
  transition: color 0.2s ease;
  margin-top: 12px;
}

.input-icon.focused {
  color: var(--vt-c-indigo);
}

.input-field {
  position: relative;
  flex: 1;
}

.input-field input {
  width: 100%;
  padding: 20px 12px 6px 0;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--vt-c-text-light-1);
}

.input-field label {
  position: absolute;
  left: 0;
  top: 16px;
  color: var(--vt-c-text-light-2);
  font-size: 16px;
  pointer-events: none;
  transition: 0.2s ease all;
}

.input-field label.active {
  top: 5px;
  font-size: 12px;
  color: var(--vt-c-indigo);
}

.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--vt-c-divider-light-2);
  transition: all 0.2s ease;
}

.input-wrapper.focused .input-line {
  height: 2px;
  background: var(--vt-c-indigo);
}

.input-wrapper.invalid .input-line {
  background: #ff5252;
}

.input-wrapper.invalid .input-icon {
  color: #ff5252;
}

.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: #ff5252;
}

.toggle-password {
  background: transparent;
  border: none;
  color: var(--vt-c-text-light-2);
  cursor: pointer;
  padding: 0 12px;
  outline: none;
  transition: color 0.2s ease;
}

.toggle-password.focused {
  color: var(--vt-c-indigo);
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.input-wrapper.focused label.active {
  color: var(--vt-c-indigo);
}

.input-wrapper.invalid label.active {
  color: #ff5252;
}

.input-wrapper.invalid .toggle-password {
  color: #ff5252;
}

@media (prefers-color-scheme: dark) {
  .input-field input {
    color: var(--vt-c-text-dark-1);
  }

  .input-field label {
    color: var(--vt-c-text-dark-2);
  }

  .input-field label.active {
    color: var(--vt-c-white);
  }

  .input-wrapper.focused .input-line {
    background: var(--vt-c-white);
  }

  .input-wrapper.focused label.active {
    color: var(--vt-c-white);
  }

  .input-icon {
    color: var(--vt-c-text-dark-2);
  }

  .input-icon.focused {
    color: var(--vt-c-white);
  }

  .toggle-password {
    color: var(--vt-c-text-dark-2);
  }

  .toggle-password.focused {
    color: var(--vt-c-white);
  }
}
</style>