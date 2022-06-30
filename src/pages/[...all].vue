<script setup>
import axios from 'axios'
import { ref } from 'vue'
import fun from '../composables/confetti.js'

const hitokoto = ref('生活总归带点荒谬')

function hito() {
  axios.get('https://v1.hitokoto.cn').then(res => hitokoto.value = res.data.hitokoto)
  fun()
}
hito()
</script>

<template>
  <n-result status="404" title="404 资源不存在" :description="hitokoto">
    <template #footer>
      <n-button @click="hito">
        找点乐子吧
      </n-button>
    </template>
  </n-result>
</template>
