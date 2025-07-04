<script setup lang="ts">


const activeStep = ref(1)

function handleStepChange(newStep: number) {
  activeStep.value = newStep
}
</script>

<template>
  <q-page class="q-pa-md">
    <!-- 步骤条 -->
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
          <strategy-check-create-task
              @next="handleStepChange(activeStep + 1)"
              @prev="handleStepChange(activeStep - 1)"
              @reset="handleStepChange(1)"
              @view-verification="handleStepChange(1)"
          />
        </q-step>
        <q-step
            :name="2"
            title="策略检查"
            icon="rule"
            :done="activeStep > 2">
          <strategy-check-verification
              @next="handleStepChange(activeStep + 1)"
              @prev="handleStepChange(activeStep - 1)"
              @reset="handleStepChange(1)"
              @view-verification="handleStepChange(1)"
          />
        </q-step>
        <q-step :name="3" title="检查结果" :done="activeStep > 3" icon="check_circle">
          <strategy-check-result
              @next="handleStepChange(activeStep + 1)"
              @prev="handleStepChange(activeStep - 1)"
              @reset="handleStepChange(1)"
              @view-verification="handleStepChange(1)"
          />
        </q-step>
      </q-stepper>

  </q-page>
</template>
