<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Example Service Unary Call Test</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submit">
          <q-input
            v-model="requestData.message"
            label="Message"
            filled
            required
          ></q-input>
          <q-input
            v-model.number="requestData.number"
            label="Number"
            type="number"
            filled
            required
            class="q-mt-md"
          ></q-input>
          <q-btn type="submit" color="primary" :loading="exampleState.loading" class="q-mt-md">
            Send Request
            <template v-slot:loading>
              <q-spinner-gears />
            </template>
          </q-btn>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1">Status:</div>
        <q-circular-progress
          v-if="exampleState.loading"
          indeterminate
          color="primary"
          class="q-ma-md"
        ></q-circular-progress>
        <q-banner v-if="exampleState.error" dense rounded class="text-white bg-red q-ma-md">
          <pre>{{ exampleState.error }}</pre>
        </q-banner>
        <div v-if="exampleState.data" class="q-ma-md">
          <div class="text-subtitle1">Response:</div>
          <pre>{{ exampleState.data.message }}</pre>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useExampleApi } from '~/composables/useApi'

const { exampleState, callUnary } = useExampleApi()

const requestData = ref({
  message: 'Hello gRPC',
  number: 123,
})

const submit = async () => {
  await callUnary(requestData.value)
}
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  color: #333;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.bg-red pre {
  color: white;
  background-color: transparent;
}
</style> 