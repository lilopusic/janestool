<script setup>
import Login from '../login.vue'
import supabase, { userRef } from '../../composables/supabase'

import Content from './content.vue'

userRef.value = supabase.auth.user()
supabase.auth.onAuthStateChange((_, session) => {
  userRef.value = session?.user
})
</script>

<template>
  <Content v-if="userRef" />
  <Login v-else />
</template>

<style lang="scss" scoped>

</style>
