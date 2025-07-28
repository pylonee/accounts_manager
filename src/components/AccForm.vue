<script setup lang="ts">
import { computed } from 'vue'
import type { Acc } from '../stores/accStore'

const props = defineProps<{
    acc: Acc,
    errors: Record<string, string>,
}>()

const emit = defineEmits([
    'update:labels',
    'update:type',
    'update:login',
    'update:password',
    'validate',
    'remove',
])

const typeOptions = [
    { label: 'LDAP', value: 'LDAP' },
    { label: 'Локальная', value: 'Локальная' },
]

const lableStr = computed({
    get: () => props.acc.labels.map(l => l.text).join('; '),
    set: (value) => {
        if (value.length > 50) return
        const labels = value
            .split(';')
            .map(text => text.trim())
            .filter(text => text)
            .map(text => ({ text }))
        emit('update:labels', labels)
    }
})

const updateType = (value: 'Локальная' | 'LDAP') => {
    emit('update:type', value)
    if (value === 'LDAP') {
        emit('update:password', null)
    } else if (props.acc.password === null) {
        emit('update:password', '')
    }
}
</script>

<template>
    <tr class="acc-row">
        <!-- поле метка -->
        <td>
            <div class="field">
                <InputText
                  v-model="lableStr"
                  placeholder="Метки вводятся через ;"
                  :class="{ 'invalid': errors.labels}"
                  @blur="$emit('validate')"
                />
                <small v-if="errors.labels" class="error">{{ errors.labels }}</small>
            </div>
        </td>

        <!-- поле тип записи -->
        <td>
            <div class="field">
                <Dropdown
                  v-model="acc.type"
                  :options="typeOptions"
                  optionLabel="label"
                  optionValue="vlaue"
                  @change="updateType($event.value)"
                  :class="{ 'invalid' : errors.type}"
                />
                <small v-if="errors.type" class="error">{{ errors.type }}</small>
            </div>
        </td>

        <!-- поле логин -->
        <td>
            <div class="field">
                <InputText
                  :modelValue="acc.login"
                  @update:modelValue="$emit('update:login', $event)"
                  @blur="$emit('validate')"
                  :class="{ 'invalid' : errors.login}"
                />
                <small v-if="errors.login" class="error">{{ errors.login }}</small>
            </div>
        </td>

        <!-- поле пароль -->
        <td>
            <div class="field" v-if="acc.type === 'Локальная'">
                <Password
                  :modelValue="acc.password || ''"
                  @update:modelValue="$emit('update:password', $event)"
                  @blur="$emit('validate')"
                  :feedback="false"
                  toogleVisible
                  :class="{ 'invalid': errors.password}"
                />
                <small v-if="errors.password" class="error">{{ errors.password }}</small>
            </div>
            <div v-else class="passInvis">
                <span>Пароль не нужен</span>
            </div>
        </td>

        <!-- кнопка удаления -->
        <td class="delete-button">
            <Button
              icon="pi-trash"
              class="button-danger"
              @click="$emit('remove')"
            />
        </td>
    </tr>
</template>

<style scoped>
.acc-row {
    border-bottom: 1px solid rgb(208, 212, 218);
    transition: background-color 0.2s;
}

.acc-row:hover {
    background-color: rgb(241, 241, 241);
}

.acc-row td {
    padding: 20px;
    vertical-align: middle;
}

.field {
    min-width: 150px;
}

.passInvis{
    padding: 10px;
}

.delete-button {
    width: 50px;
    text-align: center;
}

.error {
    display: block;
    margin-top: 4px;
    font-size: 14px;
}
</style>