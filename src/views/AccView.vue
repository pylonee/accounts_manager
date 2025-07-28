<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAccStore, type Acc } from '../stores/accStore';
import AccForm from '../components/AccForm.vue';

const store = useAccStore()
const errors = ref<Record<string, Record<string, string>>>({})

const initErrors = (acc:Acc) => {
    errors.value[acc.id] = reactive({
        labels: '',
        type: '',
        login: '',
        password: '',
    })
}


const validateAcc = (acc: Acc) => {
    const accErrors: Record<string, string> = {}


    const checkLabelLen = acc.labels.reduce((sum, label) => sum + label.text.length, 0)
    if (checkLabelLen > 50) {
        accErrors.labels = 'Максимум 50 символов'
    }


    if (!acc.login.trim()) {
        accErrors.login = 'Обязательное поле'
    } else if (acc.login.length > 100) {
        accErrors.login = 'Максимум 100 символов'
    }


    if (acc.type === 'Локальная') {
        if (!acc.password) {
            accErrors.password = 'Обязательно поле'
        } else if (acc.password.length > 100) {
            accErrors.password = 'Максимум 100 символов'
        }
    }


    Object.assign(errors.value[acc.id], accErrors)
    return Object.keys(accErrors).length === 0
}


const updateLabels = (id: string, labels: any[]) => {
    store.updateAcc(id, { labels })
    validateAcc(store.accounts.find(a => a.id === id)!)
}

const updateType = (id: string, type: 'LDAP' | 'Локальная') => {
    store.updateAcc(id, { type })
    validateAcc(store.accounts.find(a => a.id === id)!)
}

const updateLogin = (id: string, login: string) => {
    store.updateAcc(id, { login })
}

const updatePassword = (id: string, password: string) => {
    store.updateAcc(id, { password })
}


const addAcc = () => {
    const newAcc = store.addAcc()
    initErrors(newAcc)
}


const removeAcc = (id: string) => {
    store.removeAcc(id)
    delete errors.value[id]
}


store.accounts.forEach(initErrors)
</script>


<template>
    <div class="accs-view">
        <div class="title">
            <h1 class="title">Учетные записи</h1>
            <Button
              label="Добавить"
              icon="pi pi-plus"
              class="p-button-success"
              @click="addAcc"
            />
        </div>

        <div class="card">
            <div class="table">
                <table class="accs-table">
                    <thead>
                        <tr>
                            <th>Метки</th>
                            <th>Метки</th>
                            <th>Метки</th>
                            <th>Метки</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <AccForm
                          v-for="acc in store.accounts"
                          :key="acc.id"
                          :acc="acc"
                          :errors="errors[acc.id]"
                          @update:labels="updateLabels(acc.id, $event)"
                          @update:type="updateType(acc.id, $event)"
                          @update:login="updateLogin(acc.id, $event)"
                          @update:password="updatePassword(acc.id, $event)"
                          @validate="validateAcc(acc)"
                          @remove="removeAcc(acc.id)"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.accs-table {
    width: 100%;
    border-collapse: collapse;

    border: 1px solid blue;
}

.accs-table th {
    text-align: left;
    padding: 10px;
    background-color: white;
    border-bottom: 2px solid rgb(208, 212, 218);
}

.table {
    overflow-x: auto;
}

</style>