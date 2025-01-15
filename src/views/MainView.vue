<template>
  <div class="main">
    <div style="flex: 0 0 100px; overflow: scroll">
      <div v-for="item in data">{{ item.name }}</div>
    </div>
    <n-split
      direction="vertical"
      pane1-class="rule-table"
      pane2-class="list-table"
      min="106px"
      :max="0.8"
      :resize-trigger-size="3"
    >
      <template #1>
        <RuleListTable style="height: 100%; padding-top: 2px"></RuleListTable>
      </template>
      <template #2>
        <FileListTable
          v-model:data="data"
          style="height: 100%; padding-top: 2px"
        ></FileListTable>
      </template>
    </n-split>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import type { RowData as ListRowData } from "@/interface/ListDataTable";
import {
  h,
  ref,
  reactive,
  onMounted,
  defineModel,
  watch,
  isReactive,
  isRef,
} from "vue";

// import ListTable from "../components/ListTable.vue";
// import RuleListTable from "../components/RuleListTable.vue";
const FileListTable = defineAsyncComponent(
  () => import("@/components/FileListTable.vue")
);
const RuleListTable = defineAsyncComponent(
  () => import("@/components/RuleListTable.vue")
);

// const data = ref<ListRowData[]>(
//   Array.from({ length: 10 }).map((_, index) => ({
//     key: index.toString(),
//     path: `${index}`,
//     name: `Edward King ${index}`,
//     newName: `${index * 32}`,
//     state: index % 2 == 1 ? "ok" : "conflict",
//   }))
// );
const data = ref<ListRowData[]>([]);
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
    flex: 1;
  }
  .list-table {
    height: 30%;
  }
}
</style>
