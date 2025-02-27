import { defineStore } from 'pinia'

interface AuthState {
    token: string
    email: string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: '',
        email: ''
    }),

    getters: {
        isAuthenticated(): boolean {
            return Boolean(this.token && this.email)
        },
        userEmail(): string {
            return this.email
        }
    },

    actions: {
        setUserData(token: string, email: string) {
            this.token = token
            this.email = email

            localStorage.setItem('auth_token', token)
            localStorage.setItem('user_email', email)
        },

        logout() {
            this.token = ''
            this.email = ''

            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_email')
        },

        initializeStore() {
            const token = localStorage.getItem('auth_token')
            const email = localStorage.getItem('user_email')

            if (token && email) {
                this.token = token
                this.email = email
            }
        }
    }
})