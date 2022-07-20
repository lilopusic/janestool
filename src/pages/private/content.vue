<script setup>
import supabase from '../../composables/supabase'

function logout() {
  supabase.auth.signOut()
}
</script>

<template>
  <n-result
    status="warning"
    title="警告"
    description="在它变成错误以前一般不会有人管它"
  >
    <template #footer>
      <n-button>现在正在建设中</n-button>
      <n-button @click="logout">
        注销
      </n-button>
    </template>
  </n-result>
</template>

<style lang="scss" scoped>

</style>
