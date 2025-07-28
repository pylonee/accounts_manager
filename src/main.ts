import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DropDown from 'primevue/dropdown'
import Password from 'primevue/password'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Dropdown', DropDown)
app.component('Password', Password)

app.mount('#app')