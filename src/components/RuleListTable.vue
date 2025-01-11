<template>
  <n-flex vertical :size="0" style="height: 100%; padding-top: 2px">
    <n-button-group size="tiny" style="height: 26px">
      <n-button tertiary ghost type="primary">
        <template #icon>
          <n-icon>
            <Add />
          </n-icon>
        </template>
        添加
      </n-button>
      <n-button tertiary ghost type="error">
        <template #icon>
          <n-icon>
            <Remove />
          </n-icon>
        </template>
        移除
      </n-button>
      <n-button tertiary ghost>
        <template #icon>
          <n-icon>
            <ArrowUpCircle />
          </n-icon>
        </template>
        上移
      </n-button>
      <n-button tertiary ghost>
        <template #icon>
          <n-icon>
            <ArrowDownCircle />
          </n-icon>
        </template>
        下移
      </n-button>
    </n-button-group>
    <n-data-table
      size="small"
      :columns="columns"
      :data="data"
      :single-line="false"
      :row-props="rowProps"
      flex-height
      virtual-scroll
      style="flex: 1"
    />
  </n-flex>
</template>

<script setup lang="ts">
import type { DataTableColumns } from "naive-ui";
import { NCheckbox } from "naive-ui";
import { h, reactive, type HTMLAttributes } from "vue";
import {
  AddCircle as Add,
  RemoveCircle as Remove,
  ArrowUpCircle,
  ArrowDownCircle,
} from "@vicons/ionicons5";
// import { naturalCompare } from "@/utils/common";

//i 列表项数据格式
interface RowData {
  key: number;
  name: string;
  description: string;
  enable: boolean;
  isSelected: boolean;
}

// 列的定义
const columns: DataTableColumns<RowData> = [
  {
    title: "启用",
    key: "enable",
    width: 50,
    fixed: "left",
    render(rowData, rowIndex) {
      return h("div", { style: "display: flex;align-items: center;gap:4px;" }, [
        h(NCheckbox, {
          checked: rowData.enable,
          onUpdateChecked: () => (rowData.enable = !rowData.enable),
        }),
        rowIndex,
      ]);
    },
  },
  {
    title: "规则",
    key: "name",
    resizable: true,
    width: 150,
    minWidth: 120,
    maxWidth: 400,
    fixed: "left",
    ellipsis: {
      tooltip: true,
    },
    // sorter: (r1, r2) => naturalCompare(r1.name, r2.name),
  },
  {
    title: "说明",
    key: "description",
    minWidth: 100,
    maxWidth: 500,
    ellipsis: {
      tooltip: true,
    },
    // sorter: (r1, r2) => naturalCompare(r1.name, r2.name),
  },
];

const data: RowData[] = reactive(
  Array.from({ length: 2 }).map((_, index) => ({
    key: index,
    name: `Edward King ${index}`,
    description: `${index * 32}`,
    enable: true,
    isSelected: false,
  }))
);

const listSelected = reactive<number[]>([]);

function rowProps(rowData: RowData, rowIndex: number): HTMLAttributes {
  return {
    onClick(e: MouseEvent) {
      if (e.ctrlKey) {
        if (!listSelected.includes(rowData.key)) {
          listSelected.push(rowData.key);
        } else {
          const index = listSelected.findIndex((x) => x === rowData.key);
          listSelected.splice(index, 1);
        }
      } else if (e.shiftKey) {
        if (listSelected.length < 1) {
          listSelected.push(rowData.key);
        } else if (listSelected.length === 1) {
          const first = listSelected[0];
          // const firstIndex =
          console.log("data", data);
        }
      }
    },
  };
}
</script>

<style lang="sass"></style>
