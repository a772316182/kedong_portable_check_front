<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';

const props = defineProps<{
    initialData: any,
    isLoading: boolean,
    isReadonly: boolean,
}>();

const emit = defineEmits(['completed', 'cancel']);

const localStation = reactive({ ...props.initialData });

const provinces = ref<any[]>([]);
const cities = ref<any[]>([]);
const provincesLoading = ref(false);
const citiesLoading = ref(false);

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

const loadProvinces = async () => {
  if (provinces.value.length > 0 || provincesLoading.value) return;
  provincesLoading.value = true;
  try {
    const provinceData = await $fetch('/api/city', { query: { areaPid: 0 } });
    if (provinceData && provinceData.retNum === 0) {
      provinces.value = provinceData.messageContent;
    }
  } finally {
    provincesLoading.value = false;
  }
};

const loadCities = async (provinceName: string | null) => {
  cities.value = [];
  if (!provinceName) return;
  const selectedProvince = provinces.value.find(p => p.area_name === provinceName);
  if (selectedProvince) {
    citiesLoading.value = true;
    try {
      const cityData = await $fetch('/api/city', { query: { areaPid: selectedProvince.area_code } });
      if (cityData && cityData.retNum === 0) {
        cities.value = cityData.messageContent;
      }
    } finally {
      citiesLoading.value = false;
    }
  }
};

watch(() => localStation.province, async (newProvinceName) => {
    localStation.city = null;
    await loadCities(newProvinceName);
});

onMounted(async () => {
  await loadProvinces();
});

function submitForm() {
    emit('completed', localStation);
}

</script>

<template>
  <q-form @submit.prevent="submitForm">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          outlined
          v-model="localStation.stationName"
          label="厂站名称 *"
          lazy-rules
          :rules="[(val) => !!val || '厂站名称不能为空']"
          :readonly="isReadonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          outlined
          v-model="localStation.stationType"
          :options="stationTypeOptions"
          emit-value
          map-options
          label="厂站类型 *"
          lazy-rules
          :rules="[(val) => !!val || '厂站类型不能为空']"
          :readonly="isReadonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          outlined
          v-model="localStation.province"
          :options="provinces"
          option-value="area_name"
          option-label="area_name"
          map-options
          emit-value
          label="省份 *"
          :loading="provincesLoading"
          lazy-rules
          :rules="[(val) => !!val || '必须选择一个省份']"
          clearable
          :readonly="isReadonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          outlined
          v-model="localStation.city"
          :options="cities"
          option-value="area_name"
          option-label="area_name"
          map-options
          emit-value
          label="城市 *"
          :loading="citiesLoading"
          :disable="!localStation.province"
          lazy-rules
          :rules="[(val) => !!val || '必须选择一个城市']"
          clearable
          :readonly="isReadonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          outlined
          v-model="localStation.voltagelevel"
          :options="voltageLevelOptions"
          emit-value
          map-options
          label="电压等级 *"
          lazy-rules
          :rules="[(val) => !!val || '电压等级不能为空']"
          :readonly="isReadonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input 
          outlined 
          v-model="localStation.manufactor" 
          label="厂商" 
          :readonly="isReadonly"
        />
      </div>
      <div class="col-12">
        <q-toggle 
          v-model="localStation.drawTuoPu" 
          label="生成拓扑图"
          :disable="isReadonly" 
        />
      </div>
    </div>
    <q-stepper-navigation v-if="!isReadonly">
      <q-btn
        type="submit"
        label="保存并进行下一步"
        color="primary"
        :loading="isLoading"
      />
       <q-btn
        flat
        label="取消"
        color="grey"
        @click="$emit('cancel')"
        class="q-ml-sm"
      />
    </q-stepper-navigation>
  </q-form>
</template> 