<template>
  <Transition name="modal">
    <div class="todo-modal-overlay" @click="handleOverlayClick" v-if="isVisible">
      <div class="modal-container">
        <div class="modal-content">
          <h3>Aggiungi Todo</h3>
          <MaterialInput
              v-model="todoText"
              label="Scrivi il tuo todo"
              required
          />
          <div class="modal-actions">
            <MaterialButton
                label="Aggiungi"
                class="add-button"
                @click.stop="addTodo"
                :disabled="!todoText.trim()"
            />
            <MaterialButton
                label="Chiudi"
                class="close-button"
                @click.stop="closeModal"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MaterialInput from './common/Input.vue';
import MaterialButton from './common/Button.vue';

interface Props {
  isVisible?: boolean;
}

export default defineComponent({
  name: 'TodoModal',
  components: { MaterialInput, MaterialButton },
  props: {
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    addTodo: (todo: string) => typeof todo === 'string' && todo.trim().length > 0,
    closeModal: () => true
  },
  setup(props: Props, { emit }) {
    const todoText = ref('');

    const addTodo = () => {
      if (todoText.value.trim()) {
        emit('addTodo', todoText.value.trim());
        todoText.value = '';
      }
    };

    const closeModal = () => {
      emit('closeModal');
    };

    const handleOverlayClick = (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        closeModal();
      }
    };

    return { todoText, addTodo, closeModal, handleOverlayClick };
  }
});
</script>

<style scoped>
.todo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  max-width: 90%;
  margin: 0 auto;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 400px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.close-button {
  background-color: #d9534f;
  color: white;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>