<template>
  <div class="card-container">
    <div class="card">
      <div class="card-header">
        <span>{{ authStore.userEmail }}</span>
        <FontAwesomeIcon icon="sign-out-alt" class="logout-icon" @click="handleLogout" />
      </div>
      <div class="card-body">
        <div class="button-row">
          <MaterialButton label="Crea Todo" @click="toggleShowTodo" />
          <MaterialButton label="Salva" @click="handleSave" color="success" />
        </div>
        <div class="todo-list">
          <ul>
            <li v-for="todo in todos.todos" :key="todo.id" class="todo-item">
              <span :class="{ completed: todo.completed }">{{ todo.task }}</span>
              <div class="button-group">
                <MaterialButton :label="todo.completed ? 'Ripristina' : 'Completa'" @click="todos.toggleTodo(todo.id)"
                  :color="todo.completed ? 'secondary' : 'primary'" />
                <MaterialButton label="Elimina" @click="handleDelete(todo)" color="danger" class="delete-btn" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <TodoModal v-if="showAddTodo" @closeModal="toggleShowTodo" @addTodo="handleAddTodo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTodoStore } from "../stores/todoStore";
import MaterialButton from "../components/common/Button.vue";
import TodoModal from "../components/CreateTodo.vue";
import { getHeaders, url } from '../fetch_conf';

export default defineComponent({
  name: 'UserCard',
  components: { TodoModal, MaterialButton },
  setup() {
    const authStore = useAuthStore();
    const todos = useTodoStore();
    const router = useRouter();
    const showAddTodo = ref(false);

    onMounted(async () => {
      authStore.initializeStore();
      if (!authStore.isAuthenticated) {
        router.push('/login');
      }
      const res = fetch(`${url}todos`, {
        headers: getHeaders(authStore.token),
      });
      const data = await res.then((res) => res.json());
      todos.setTodos(data);
    });

    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };

    const toggleShowTodo = () => {
      showAddTodo.value = !showAddTodo.value;
    };

    const handleAddTodo = (todo: string) => {
      todos.addTodo(todo);
      toggleShowTodo();
    };

    const handleSave = async () => {
      todos.saveTodos();
      const response = await fetch(`${url}todos`, {
        method: 'POST',
        headers: getHeaders(authStore.token),
        body: JSON.stringify(todos.todos),
      });
      if (!response.ok) {
        console.error('Error saving todos');
      }
    };

    const handleDelete = async (todo: { id: string; task: string; completed: boolean }) => {
      try {
        const response = await fetch(`${url}delete`, {
          method: 'POST',
          headers: getHeaders(authStore.token),
          body: JSON.stringify({ id: todo.id }),
        });
        if (response.ok) {
          todos.removeTodo(todo.id); // Remove the todo locally after successful API call
        } else {
          console.error('Error deleting todo');
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    return {
      authStore,
      todos,
      handleLogout,
      toggleShowTodo,
      showAddTodo,
      handleAddTodo,
      handleSave,
      handleDelete,
    };
  },
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
  flex-direction: column;
  align-items: flex-start;
}

.button-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.todo-list {
  margin-top: 1rem;
  width: 100%;
}

.todo-list h3 {
  margin-bottom: 0.5rem;
  text-align: center;
}

.todo-list ul {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border, #eee);
}

.todo-item .completed {
  text-decoration: line-through;
  color: #6c757d;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  /* Add space between buttons */
}

.delete-btn {
  background-color: #d9534f !important;
  /* Make the button red */
  color: white !important;
}
</style>