<script setup lang="ts">
const registerCode = ref('xxxxxxxxxxxxxxxxxxxxxxxxx')
const authorizationSerialNumber = ref('')
</script>

<template>
  <div>
    <q-card bordered flat>
      <q-card-section>
        <span class="text-h6">授权管理</span>
      </q-card-section>
      <q-card-section>
        <p class="text-center text-body1">
          当前该设备未授权，授权后方可正常使用
        </p>
        <q-separator inset spaced/>
      </q-card-section>
      <q-card-section>
        <div class="text-center text-body1">
          <p class="text-primary text-weight-bold text-body1">本机注册码：{{ registerCode }}</p>
          <p>请将注册码发送给北京科东厂站自动化系统专员，专员会返回授权序列号</p>
          <p>联系方式：xxxxxxxxxxxx 张三</p>
        </div>
      </q-card-section>
      <q-card-section class="row">
        <p class="col-4 offset-4">
          <q-input v-model="authorizationSerialNumber" class="full-width" placeholder="请在此处输入授权序列号" outlined>
            <template #after>
              <q-btn color="primary" size="large">验证</q-btn>
            </template>
          </q-input>
        </p>
      </q-card-section>
    </q-card>
    <q-card bordered flat>
      <q-card-section>
        <span class="text-h6">授权管理</span>
      </q-card-section>
      <q-card-section>
        <div class="text-center">
          <p>
            <Icon name="ep:success-filled" size="100" class="bg-primary"/>
          </p>
          <p class="text-h4 text-weight-bold text-primary">授权成功</p>
          <p class="text-primary text-weight-bold text-body1">本机注册码：{{ registerCode }}</p>
          <p class="text-primary text-weight-bold text-body1">本机授权码：{{ authorizationSerialNumber }}</p>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>

</style>