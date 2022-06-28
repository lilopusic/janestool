<template>
  <div class="box-border p-4 w-full">
    <n-button-group>
      <n-button>
        <router-link class="no-underline" to="/Agg">Go to Agg</router-link>
      </n-button>
      <n-button>
        <router-link class="no-underline" to="/Whatever">Whatever</router-link>
      </n-button>
    </n-button-group>

    <n-divider></n-divider>
    <router-view></router-view>
  </div>
</template>

<script setup>

</script>
