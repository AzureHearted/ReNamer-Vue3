<template>
  <div class="main">
    <div style="flex: 0 0 100px"></div>
    <n-split
      direction="vertical"
      pane1-class="rule-table"
      pane2-class="list-table"
      pane1-style="overflow:visible"
      pane2-style="overflow:visible"
      min="80px"
      :max="0.9"
      :resize-trigger-size="3"
    >
      <template #1>
        <RuleListTable></RuleListTable>
      </template>
      <template #2>
        <ListTable></ListTable>
      </template>
    </n-split>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
// import ListTable from "../components/ListTable.vue";
// import RuleListTable from "../components/RuleListTable.vue";
const ListTable = defineAsyncComponent(
  () => import("@/components/ListTable.vue")
);
const RuleListTable = defineAsyncComponent(
  () => import("@/components/RuleListTable.vue")
);
</script>

<style lang="scss" scoped>
.main {
  position: fixed;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  gap: 5px;
  padding: 5px;

  .rule-table {
    height: 30%;
  }
  .list-table {
    flex: 1;
  }
}
</style>
