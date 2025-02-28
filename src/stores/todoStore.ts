import { defineStore } from 'pinia';

export interface Todo {
    id: string;
    task: string;
    completed: boolean;
}

export const useTodoStore = defineStore('todo', {
    state: () => {
        const savedTodos = localStorage.getItem('todos');
        return {
            todos: savedTodos ? (JSON.parse(savedTodos) as Todo[]) : [] as Todo[],
        };
    },
    actions: {
        saveTodos() {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        },

        addTodo(task: string) {
            const newTodo: Todo = {
                id: Math.random().toString(36).substring(2, 9),
                task,
                completed: false,
            };
            this.todos.push(newTodo);
            this.saveTodos();
        },

        toggleTodo(id: string) {
            const todo = this.todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                this.saveTodos();
            }
        },

        removeTodo(id: string) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
        },
    },
    getters: {
        pendingTodos(state): Todo[] {
            return state.todos.filter(todo => !todo.completed);
        },
        completedTodos(state): Todo[] {
            return state.todos.filter(todo => todo.completed);
        },
    },
});