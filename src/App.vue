<script setup>
import { darkTheme, lightTheme } from 'naive-ui'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme">
    <div class="box-border p-4 w-full">
      <n-button-group>
        <n-button @click="$router.push('/agg')">
          Agg
        </n-button>
        <n-button @click="$router.push('/whatever')">
          Whatever
        </n-button>
        <n-button @click="toggleDark()">
          {{ isDark ? 'Dark' : 'Light' }}
        </n-button>
      </n-button-group>

      <n-divider />
      <router-view />
    </div>
    <n-global-style />
  </n-config-provider>
</template>
