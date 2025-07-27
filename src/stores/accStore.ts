import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Label {
    text: string
}

interface Acc {
    id: string,
    labels: Label[],
    type: 'Локальная' | 'LDAP',
    login: string,
    password: string | null,
}

export const useAccStore = defineStore('accounts', () => {
    const accounts = ref<Acc[]>([])

    const loadAccs = () => {
        const existing = localStorage.getItem('accounsts')
        if (existing) {
            try {
                accounts.value = JSON.parse(existing)
            } catch (e) {
                console.error('Аккаунты не были загружены', e)
            }
        }
    }

    const saveAccs = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts.value))
    }

    const addAcc = () => {
        const newAcc: Acc = {
            id: Date.now().toString(),
            labels: [],
            type: 'Локальная',
            login: '',
            password: '',
        }
        accounts.value.push(newAcc)
        saveAccs()
        return newAcc
    }

    const removeAcc = (id: string) => {
        accounts.value = accounts.value.filter(acc => acc.id != id)
        saveAccs()
    }

    loadAccs()

    return {
        accounts,
        addAcc,
        removeAcc,
    }
})