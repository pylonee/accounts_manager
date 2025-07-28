import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Label {
    text: string
}

export interface Acc {
    id: string,
    labels: Label[],
    type: 'LDAP' | 'Локальная',
    login: string,
    password: string | null,
}

export const useAccStore = defineStore('accounts', () => {
    const accounts = ref<Acc[]>([])

    // localStorage загрузка аккаунтов
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

    // localStorage сохранение аккаунтов
    const saveAccs = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts.value))
    }

    // Добавление нового аккаунта
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

    // Обновление аккаунта
    const updateAcc = (id: string, update: Partial<Acc>) => {
        const acc = accounts.value.find(a => a.id === id)
        if (acc) {
            Object.assign(acc, update)
            saveAccs()
        }
    }

    // Удаление аккаунта
    const removeAcc = (id: string) => {
        accounts.value = accounts.value.filter(acc => acc.id != id)
        saveAccs()
    }

    loadAccs()

    return {
        accounts,
        addAcc,
        updateAcc,
        removeAcc,
    }
})