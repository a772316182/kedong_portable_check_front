<script setup lang="ts">
import {ref} from 'vue'

const activeStep = ref(1)

function handleStepChange(newStep: number) {
  activeStep.value = newStep
}
</script>

<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-stepper
          v-model="activeStep"
          flat
          header-nav
          active-color="primary"
          done-color="positive"
          inactive-color="grey-6"
      >
        <q-step
            :name="1"
            title="创建任务"
            icon="list_alt"
            :done="activeStep > 1">
          <alarm-verification-create-task
              @next="handleStepChange(activeStep + 1)"
              @prev="handleStepChange(activeStep - 1)"
              @reset="handleStepChange(1)"
              @view-verification="handleStepChange(1)"
          />
        </q-step>
        <q-step
            :name="2"
            title="告警验证"
            icon="rule"
            :done="activeStep > 2">
          <alarm-verification-verification
              @next="handleStepChange(activeStep + 1)"
              @prev="handleStepChange(activeStep - 1)"
              @reset="handleStepChange(1)"
              @view-verification="handleStepChange(1)"
          />
        </q-step>
        <q-step :name="3" title="验证结果" :done="activeStep > 3" icon="check_circle">
          <alarm-verification-result
              @next="handleStepChange(activeStep + 1)"
              @prev="handleStepChange(activeStep - 1)"
              @reset="handleStepChange(1)"
              @view-verification="handleStepChange(1)"
          />
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>
