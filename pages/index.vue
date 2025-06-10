<script setup lang="ts">
const username = ref('')
const password = ref('')
const router = useRouter()
definePageMeta({
  layout: 'without-drawer'
})

const login = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="q-pa-md full-height">
    <div class="row full-height" style="padding-top: 10%">
      <div class="col-10 offset-1 full-height">
        <q-card class="q-pa-md full-height">
          <div class="row full-height" style="padding: 50px">
            <div class="col-7">
              图片占位符
            </div>
            <div class="col-5">
              <div class="row">
                <span class="text-h2 text-primary text-weight-bold">便携式检查工具</span>
              </div>
              <div class="row" style="padding-top: 20%">
                <div class="col-12">
                  <span class="text-h5"><b>用户登录</b></span>
                </div>
              </div>
              <div class="row" style="padding-top: 3%">
                <div class="col-12">
                  <q-input v-model="username" filled label="请输入账号"/>
                </div>
              </div>
              <div class="row" style="padding-top: 3%">
                <div class="col-12">
                  <q-input v-model="password" filled label="请输入密码" type="password"/>
                </div>
              </div>
              <div class="row" style="padding-top: 3%">
                <div class="col-12">
                  <q-btn label="登录" class="full-width" color="primary" @click="login"/>
                </div>
              </div>
              <div class="row" style="padding-top: 3%">
                <div class="col-12">
                  <q-btn label="退出" class="full-width" color="info" text-color="black"/>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <q-footer class="bg-transparent text-center text-weight-bold text-white">
      便携式检查工具V3.0
      <br>
      Copyright@北京科东. All rights reserved
    </q-footer>
  </div>
</template>

<style scoped>
</style>