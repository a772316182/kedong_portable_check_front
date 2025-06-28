<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { useQuasar } from 'quasar';

const props = defineProps<{
  initialData: any;
  isLoading: boolean;
  isReadonly: boolean;
}>();

const emit = defineEmits<{
  (e: 'completed', data: any): void,
  (e: 'cancel'): void
}>();

const stationData = reactive({ ...props.initialData });

const stationTypeOptions = [
  { label: "变电站", value: "变电站" },
  { label: "水电站", value: "水电站" },
  { label: "换流站", value: "换流站" },
  { label: "风电站", value: "风电站" },
  { label: "光伏站", value: "光伏站" },
];
const voltageLevelOptions = [
  { label: "1000kV", value: 1000 },
  { label: "750kV", value: 750 },
  { label: "500kV", value: 500 },
  { label: "330kV", value: 330 },
  { label: "220kV", value: 220 },
  { label: "110kV", value: 110 },
  { label: "35kV", value: 35 },
  { label: "10kV", value: 10 },
];

const provinces = ref<any[]>([]);
const cities = ref<any[]>([]);
const provincesLoading = ref(false);
const citiesLoading = ref(false);

const loadProvinces = async () => {
    if (provinces.value.length > 0 || provincesLoading.value) return;
    provincesLoading.value = true;
    try {
        const provinceData = await $fetch('/api/city', { query: { areaPid: 0 } });
        if (provinceData && provinceData.retNum === 0) {
            provinces.value = provinceData.messageContent;
        }
    } catch (e) {
        console.error("加载省份失败:", e);
    } finally {
        provincesLoading.value = false;
    }
};

const loadCities = async (provinceName: string | null) => {
    cities.value = [];
    if (!provinceName) return;

    await loadProvinces(); 

    const selectedProvince = provinces.value.find(p => p.area_name === provinceName);
    if (selectedProvince) {
        citiesLoading.value = true;
        try {
            const cityData = await $fetch('/api/city', { query: { areaPid: selectedProvince.area_code } });
            if (cityData && cityData.retNum === 0) {
                cities.value = cityData.messageContent;
            }
        } catch (e) {
            console.error("加载城市失败:", e);
        } finally {
            citiesLoading.value = false;
        }
    }
};

watch(() => props.initialData, (newData) => {
    Object.assign(stationData, newData);
    if(newData.province) {
        loadCities(newData.province);
    }
}, { deep: true, immediate: true });


watch(() => stationData.province, (newProvince) => {
    stationData.city = null;
    if (newProvince) {
        loadCities(newProvince);
    }
});

function onSubmit() {
  emit('completed', stationData);
}

function onCancel() {
  emit('cancel');
}

onMounted(() => {
    loadProvinces();
});
</script>

<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">步骤 1: 填写基础信息</div>
    <q-form @submit="onSubmit" class="q-gutter-y-md">
       <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
            <q-input
            outlined
            v-model="stationData.stationId"
            label="厂站ID"
            hint="如果是新增厂站，此ID将在保存后自动生成"
            readonly
            :disable="isReadonly"
            />
        </div>
         <div class="col-12 col-md-6">
            <q-input
                outlined
                v-model="stationData.stationName"
                label="厂站名称 *"
                :rules="[(val) => !!val || '厂站名称不能为空']"
            />
        </div>
         <div class="col-12 col-md-6">
            <q-select
                outlined
                v-model="stationData.stationType"
                :options="stationTypeOptions"
                emit-value
                map-options
                label="厂站类型 *"
                :rules="[(val) => !!val || '厂站类型不能为空']"
                />
        </div>
         <div class="col-12 col-md-6">
            <q-select
                outlined
                v-model="stationData.province"
                :options="provinces"
                option-value="area_name"
                option-label="area_name"
                map-options
                emit-value
                label="省份 *"
                :loading="provincesLoading"
                :rules="[(val) => !!val || '必须选择一个省份']"
                clearable
            />
        </div>
        <div class="col-12 col-md-6">
            <q-select
                outlined
                v-model="stationData.city"
                :options="cities"
                option-value="area_name"
                option-label="area_name"
                map-options
                emit-value
                label="城市 *"
                :loading="citiesLoading"
                :disable="!stationData.province"
                :rules="[(val) => !!val || '必须选择一个城市']"
                clearable
                />
        </div>
        <div class="col-12 col-md-6">
            <q-select
                outlined
                v-model="stationData.voltagelevel"
                :options="voltageLevelOptions"
                emit-value
                map-options
                label="电压等级 *"
                :rules="[(val) => val !== null || '电压等级不能为空']"
                />
        </div>
        <div class="col-12 col-md-6">
            <q-input
                outlined
                v-model="stationData.manufactor"
                label="厂商"
            />
        </div>
        <div class="col-12">
            <q-toggle v-model="stationData.drawTuoPu" label="生成拓扑图" />
        </div>
      </div>

       <q-stepper-navigation>
        <q-btn type="submit" color="primary" label="保存并下一步" :loading="isLoading" />
        <q-btn flat @click="onCancel" color="primary" label="取消" class="q-ml-sm" />
      </q-stepper-navigation>
    </q-form>
  </q-page>
</template> 