<script setup>
import { ref } from 'vue'
import supabase, { userRef } from '../composables/supabase'

const loading = ref(false)
const email = ref('')
const password = ref('')

async function login() {
  loading.value = true
  const { error, user } = await supabase.auth.signIn({
    email: email.value,
    password: password.value,
  })
  loading.value = false

  if (error) {
    alert('登录失败!')
    return
  }

  userRef.value = user
}

async function register() {
  loading.value = true
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (error)
    alert('注册失败!')
  alert('请检查邮箱确认注册!')
}
</script>

<template>
  <n-card>
    <n-tabs
      default-value="signin"
      size="large"
      justify-content="center"
      type="segment"
      animated
    >
      <n-tab-pane name="signin" tab="登录">
        <n-form>
          <n-form-item-row label="邮箱">
            <n-input v-model:value="email" placeholder="请输入邮箱地址" />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input v-model:value="password" type="password" placeholder="请输入密码" />
          </n-form-item-row>
        </n-form>
        <n-button :loading="loading" type="primary" block primary strong @click="login">
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="邮箱">
            <n-input v-model:value="email" placeholder="请输入邮箱地址" />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input v-model:value="password" type="password" placeholder="请输入密码" />
          </n-form-item-row>
        </n-form>
        <n-button :loading="loading" type="primary" block primary strong @click="register">
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>

</style>
