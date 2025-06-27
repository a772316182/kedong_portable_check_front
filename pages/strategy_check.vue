<script setup lang="ts">
import {ref} from 'vue'


const activeStep = ref(0)

function handleStepChange(newStep: number) {
  activeStep.value = newStep
}
</script>

<template>
  <q-page class="q-pa-md">
    <!-- 步骤条 -->
    <div class="q-mb-md">
      <q-stepper
          v-model="activeStep"
          flat
          bordered
          header-nav
          active-color="primary"
          done-color="positive"
          inactive-color="grey-6"
      >
        <q-step
            v-for="(label, index) in ['创建任务', '策略检查', '检查结果']"
            :key="index"
            :name="index"
            :title="label"
            :done="activeStep > index"/>
      </q-stepper>
    </div>

    <strategy-check-create-task
        v-if="activeStep === 0"
        @next="handleStepChange(activeStep + 1)"
        @prev="handleStepChange(activeStep - 1)"
        @reset="handleStepChange(0)"
        @view-verification="handleStepChange(1)"
    />

    <strategy-check-verification
        v-else-if="activeStep === 1"
        @next="handleStepChange(activeStep + 1)"
        @prev="handleStepChange(activeStep - 1)"
        @reset="handleStepChange(0)"
        @view-verification="handleStepChange(1)"
    />

    <strategy-check-result
        v-else-if="activeStep === 2"
        @next="handleStepChange(activeStep + 1)"
        @prev="handleStepChange(activeStep - 1)"
        @reset="handleStepChange(0)"
        @view-verification="handleStepChange(1)"
    />
  </q-page>
</template>
