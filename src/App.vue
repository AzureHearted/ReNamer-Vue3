<template>
  <n-config-provider :theme="isDark ? darkTheme : null">
    <RouterView />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { usePreferredDark } from "@vueuse/core";
const isDark = usePreferredDark();
</script>
<style scoped></style>
