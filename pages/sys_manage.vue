<script setup lang="ts">
const tab_name = ref('authorization')
</script>

<template>
  <div>
    <q-page class="q-pa-md q-gutter-y-md">
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
            class="col-12"
        >
          <q-tab-panel name="baseline">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alert">
            <div class="text-h6">Alarms</div>
            Ad molestiae non facere animi nobis, similique nemo.
          </q-tab-panel>

          <q-tab-panel name="import_template">
            <div class="text-h6">Movies</div>
            Nostrum necessitatibus expedita dolores? Voluptatem.
          </q-tab-panel>
          <q-tab-panel name="authorization">
            <sys-manage-authorization-config/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-page>
  </div>
</template>

<style scoped>

</style>