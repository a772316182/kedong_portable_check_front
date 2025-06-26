<script setup lang="ts">
import { ref } from 'vue'
import CreateTask from '~/components/alarm_verification_createTask.vue'
import AlarmVerification from '~/components/alarm_verification_verification.vue'
import VerificationResult from '~/components/alarm_verification_result.vue'


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
v-for="(label, index) in ['创建任务', '告警验证', '验证结果']"
                :key="index"
                :name="index"
                :title="label"
                :done="activeStep > index" />
      </q-stepper>
    </div>

    <!-- 动态组件 -->
    <component
      :is="[
        CreateTask,
        AlarmVerification,
        VerificationResult
      ][activeStep]"
      @next="handleStepChange(activeStep + 1)"
      @prev="handleStepChange(activeStep - 1)"
      @reset="handleStepChange(0)"
      @view-verification="handleStepChange(1)" 
    />
  </q-page>
</template>
