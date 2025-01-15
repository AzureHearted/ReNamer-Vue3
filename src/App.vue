<template>
  <n-config-provider :theme="isDark ? darkTheme : null">
    <RouterView />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { usePreferredDark } from "@vueuse/core";
import { VxeUI } from "vxe-table";
import { watch } from "vue";
import { onMounted } from "vue";
const isDark = usePreferredDark();
onMounted(() => {
  changeTheme(isDark.value);
  watch(isDark, (value) => {
    changeTheme(value);
  });
});

function changeTheme(isDark: boolean) {
  if (isDark) {
    // 切换为暗黑主题
    VxeUI.setTheme("dark");
  } else {
    // 切换为默认主题
    VxeUI.setTheme("light");
  }
}
</script>
<style scoped></style>
