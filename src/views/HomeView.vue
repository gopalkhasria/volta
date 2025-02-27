<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <span>{{ authStore.userEmail }}</span>
        <FontAwesomeIcon
            icon="sign-out-alt"
            class="logout-icon"
            @click="handleLogout"
        />
      </div>
      <div class="card-body">
        <MaterialButton
            label="Crea Todo"
            @click="toggleShowTodo"
        />
      </div>
    </div>
    <TodoModal
        v-if="showAddTodo"
        @closeModal="toggleShowTodo"
        @addTodo="handleAddTodo"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTodoStore } from "../stores/todoStore";
import MaterialButton from "../components/common/Button.vue";
import TodoModal from "../components/CreateTodo.vue";

export default defineComponent({
  name: 'UserCard',
  components: {TodoModal, MaterialButton},
  setup() {
    const authStore = useAuthStore();
    const todos = useTodoStore();
    const router = useRouter();
    const showAddTodo = ref(false);

    onMounted(() => {
      authStore.initializeStore();
      if (!authStore.isAuthenticated) {
        router.push('/login');
      }
    });

    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };

    const toggleShowTodo = () =>{
      console.log("Ciao")
      showAddTodo.value = !showAddTodo.value;
    }
    const handleAddTodo = (todo: string) => {
      todos.addTodo(todo)
      toggleShowTodo();
    };

    return { authStore, handleLogout, toggleShowTodo, showAddTodo, handleAddTodo};
  }
});
</script>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.card {
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--color-border, #ccc);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background-mute, #fff);
  overflow: hidden;
  color: var(--vt-c-white, #333);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border, #eee);
  font-weight: bold;
  color: var(--vt-c-white, #333);
}

.logout-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #d9534f;
}

.card-body {
  padding: 1rem;
  display: flex;
  justify-content: center;
}
</style>