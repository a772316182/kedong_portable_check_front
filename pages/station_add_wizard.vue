<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBasicConfigApi } from "~/composables/useApi";
import { useQuasar } from 'quasar';

import StepBasicInfo from '~/components/station_wizard/StepBasicInfo.vue';
import StepNetworkConfig from '~/components/station_wizard/StepNetworkConfig.vue';
import StepLedgerMaintenance from '~/components/station_wizard/StepLedgerMaintenance.vue';
import StepTopologyDrawing from '~/components/station_wizard/StepTopologyDrawing.vue';
import StepNetworkDiscovery from '~/components/station_wizard/StepNetworkDiscovery.vue';
import StepAssetDiscovery from '~/components/station_wizard/StepAssetDiscovery.vue';

// const StepAssetDiscovery = { template: '<div><p class="text-subtitle1">在已配置的网段内，对资产进行更详细的探测和识别。</p><p>系统将尝试识别设备类型、操作系统、开放端口等信息。</p><q-stepper-navigation><q-btn @click="$emit(\'next\')" color="primary" label="继续" /><q-btn @click="$emit(\'back\')" flat color="primary" label="返回" class="q-ml-sm" /></q-stepper-navigation></div>', emits: ['next', 'back'] };

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const { addStation, getStation } = useBasicConfigApi();
const loading = ref(false);
const step = ref(1);
const stationId = ref<string | null>(route.query.id as string | undefined || null);

const wizardData = reactive({
  basicInfo: {
    stationId: "", 
    stationName: "",
    stationType: "",
    province: null as string | null,
    city: null as string | null,
    voltagelevel: null as number | null,
    manufactor: "",
    drawTuoPu: true,
  },
  progress: {
      currentStep: 1,
      completedSteps: [] as number[],
      skippedSteps: [] as number[],
  }
});

// 加载厂站数据和进度
async function loadProgress() {
  if (!stationId.value) {
    step.value = 1;
    return;
  }
  loading.value = true;
  try {
    const response = await getStation(stationId.value);
    if (response && response.retNum === 0) {
      // 修正：API的messageContent直接就是厂站基础信息，而不是包含{basicInfo, progress}的对象
      const stationData = response.messageContent;
      Object.assign(wizardData.basicInfo, stationData);

      // 由于后端API暂未提供进度信息，我们在此进行模拟
      // 当用户"继续配置"时，我们默认第一步已完成，并从第二步开始
      // TODO: 未来此处应替换为从后端获取真实进度的逻辑
      wizardData.progress.completedSteps = [1];
      wizardData.progress.currentStep = 2; // 默认跳转到第二步
      step.value = wizardData.progress.currentStep;
      
      $q.notify({ type: 'info', message: '已恢复厂站信息，请继续配置。' });
    } else {
       throw new Error(response?.errMessage || '无法加载厂站数据');
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: `加载进度失败: ${error.message}` });
    // 加载失败则退回列表页，避免数据不一致
    router.push('/basic_info');
  } finally {
    loading.value = false;
  }
}

async function handleStep1Complete(basicInfo: any) {
  Object.assign(wizardData.basicInfo, basicInfo);
  loading.value = true;
  try {
    const apiCall = stationId.value 
      ? Promise.resolve({ retNum: 0, errMessage: "", messageContent: { ...wizardData.basicInfo, stationId: stationId.value } }) 
      : addStation({ ...wizardData.basicInfo, stationId: "" });
    const response = await apiCall;

    if (response && response.retNum === 0) {
      if (!stationId.value) {
        stationId.value = response.messageContent.stationId;
        router.replace({ query: { id: stationId.value } });
      }
      wizardData.progress.completedSteps.push(1);
      wizardData.progress.currentStep = 2;
      step.value = 2;
      $q.notify({ type: 'positive', message: '基础信息已保存。' });
    } else {
       $q.notify({ type: 'negative', message: `保存失败: ${response?.errMessage || '未知错误'}` });
    }
  } catch (error: any) {
     $q.notify({ type: 'negative', message: `保存失败: ${error.message}` });
  } finally {
    loading.value = false;
  }
}

function nextStep(currentStep: number) {
    wizardData.progress.completedSteps.push(currentStep);
    step.value++;
    wizardData.progress.currentStep = step.value;
}

function skipStep(currentStep: number) {
    wizardData.progress.skippedSteps.push(currentStep);
    step.value++;
    wizardData.progress.currentStep = step.value;
    $q.notify({ message: `已跳过步骤 ${currentStep}。`, color: 'grey-7' });
}

function prevStep() {
    step.value--;
}

function isStepDone(s: number) {
    return wizardData.progress.completedSteps.includes(s) || wizardData.progress.skippedSteps.includes(s);
}

function getStepIcon(s: number) {
    if (wizardData.progress.completedSteps.includes(s)) return 'check_circle';
    if (wizardData.progress.skippedSteps.includes(s)) return 'redo';
    return 'pending';
}

function finishWizard() {
    $q.notify({ type: 'positive', message: '厂站添加流程完成！' });
    router.push('/basic_info');
}

function exitWizard() {
  const message = stationId.value 
    ? '确定要退出吗？当前进度已保存，您可以稍后从主列表继续。'
    : '确定要取消新增厂站吗？所有未保存的进度将会丢失。';
  
  $q.dialog({
    title: '确认退出',
    message,
    cancel: true,
    persistent: true
  }).onOk(() => {
    router.push('/basic_info');
  })
}

onMounted(loadProgress);
</script>

<template>
  <q-page class="q-pa-md  q-gutter-y-md">
    <div >
      
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5">新增/配置厂站流程</div>
        <q-btn icon="close" flat round dense @click="exitWizard" />
      </div>

      <q-stepper
        v-model="step"
        header-nav
        color="primary"
        animated
        flat
        bordered
        class="q-mb-md"
      >
        <q-step :name="1" title="基础信息" :icon="getStepIcon(1)" :done="isStepDone(1)" />
        <q-step :name="2" title="网段探测" :icon="getStepIcon(2)" :done="isStepDone(2)" caption="可选" />
        <q-step :name="3" title="网段配置" :icon="getStepIcon(3)" :done="isStepDone(3)" />
        <q-step :name="4" title="资产探测" :icon="getStepIcon(4)" :done="isStepDone(4)" caption="可选" />
        <q-step :name="5" title="台账维护" :icon="getStepIcon(5)" :done="isStepDone(5)" />
        <q-step :name="6" title="拓扑绘制" :icon="getStepIcon(6)" :done="isStepDone(6)" />
      </q-stepper>

      <q-tab-panels v-model="step" animated class="col">
        <q-tab-panel :name="1" class="q-pa-none">
          <StepBasicInfo
            :initial-data="wizardData.basicInfo"
            :is-loading="loading"
            :is-readonly="!!stationId"
            @completed="handleStep1Complete"
            @cancel="exitWizard"
          />
        </q-tab-panel>

        <q-tab-panel :name="2" class="q-pa-none">
          <StepNetworkDiscovery 
            v-if="stationId" 
            :station-id="stationId"
            @next="nextStep(2)"
            @back="prevStep"
            @skip="skipStep(2)"
          />
          <div v-else class="text-center text-grey q-pa-md">
            <q-icon name="warning" size="md" />
            <p>请先完成第一步以获取厂站ID</p>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="3" class="q-pa-none">
          <StepNetworkConfig v-if="stationId" :station-id="stationId" />
          <div v-else class="text-center text-grey q-pa-md">
            <q-icon name="warning" size="md" />
            <p>请先完成第一步以获取厂站ID</p>
          </div>
          <div class="q-pa-md">
            <q-stepper-navigation>
              <q-btn @click="nextStep(3)" color="primary" label="保存并下一步" />
              <q-btn @click="prevStep" flat color="primary" label="返回" class="q-ml-sm" />
            </q-stepper-navigation>
          </div>
        </q-tab-panel>
        
        <q-tab-panel :name="4" class="q-pa-none">
           <StepAssetDiscovery
             v-if="stationId"
             :station-id="stationId"
             @next="nextStep(4)"
             @back="prevStep"
             @skip="skipStep(4)"
           />
           <div v-else class="text-center text-grey q-pa-md">
             <q-icon name="warning" size="md" />
             <p>请先完成前面的步骤以获取厂站ID</p>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="5" class="q-pa-none">
          <StepLedgerMaintenance v-if="stationId" :station-id="stationId" />
          <div v-else class="text-center text-grey q-pa-md">
            <q-icon name="warning" size="md" />
            <p>请先完成第一步以获取厂站ID</p>
          </div>
           <div class="q-pa-md">
            <q-stepper-navigation>
              <q-btn @click="nextStep(5)" color="primary" label="保存并下一步" />
              <q-btn @click="prevStep" flat color="primary" label="返回" class="q-ml-sm" />
            </q-stepper-navigation>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="6" class="q-pa-none">
          <StepTopologyDrawing v-if="stationId" :station-id="stationId" />
          <div v-else class="text-center text-grey q-pa-md">
            <q-icon name="warning" size="md" />
            <p>请先完成第一步以获取厂站ID</p>
          </div>
          <div class="q-pa-md">
            <q-stepper-navigation>
              <q-btn @click="finishWizard" color="positive" label="完成" />
              <q-btn @click="prevStep" flat color="primary" label="返回" class="q-ml-sm" />
            </q-stepper-navigation>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template> 