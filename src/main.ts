import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faCheckCircle, faExclamationTriangle, faEnvelope,faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEye, faEyeSlash, faCheckCircle, faExclamationTriangle, faEnvelope,faSignOutAlt);


const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.use(createPinia())
app.use(router)

app.mount('#app')
