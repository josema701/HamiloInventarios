<template>

    <Menu v-if="route.currentRoute.value.path !== '/login'" />
  

    <div class="container pt-3">
      <RouterView />
    </div>


</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import Menu from './components/Menu.vue'

  import { useRouter } from 'vue-router'
  const route = useRouter();
  // console.log(route.currentRoute.value.path);

</script>

<style scoped></style>
