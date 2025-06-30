<script setup lang="ts">
const tab_name = ref('import_template')
</script>

<template>
  <div>
    <q-page class="q-pa-md q-gutter-y-md">
      <q-card flat>
        <q-card-section>
      <div class="row q-gutter-x-md">
        <q-btn color="primary" @click="tab_name='baseline'">基线核查配置</q-btn>
        <q-btn color="primary" @click="tab_name='alert'">告警验证配置</q-btn>
        <q-btn color="primary" @click="tab_name='import_template'">导入模版配置</q-btn>
        <q-btn color="primary" @click="tab_name='authorization'">授权管理</q-btn>
      </div>
      <div class="row q-gutter-x-md">
        <q-tab-panels
            v-model="tab_name"
            animated
            transition-prev="fade"
            transition-next="fade"
            class="full-width"
        >
          <q-tab-panel name="baseline">
            <sys-manage-baseline-check-config/>
          </q-tab-panel>

          <q-tab-panel name="alert">
            <sys-manage-alarm-verification-config/>
          </q-tab-panel>

          <q-tab-panel name="import_template">
            <sys-manage-import-template-config/>
          </q-tab-panel>
          <q-tab-panel name="authorization">
            <sys-manage-authorization-config/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<style scoped>

</style>