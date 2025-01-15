<template>
  <n-flex vertical :size="2" style="height: 100%">
    <n-flex style="height: 26px">
      <n-button-group size="tiny">
        <n-dropdown trigger="click" :options="options">
          <n-button tertiary type="primary"> 文件 </n-button>
        </n-dropdown>
        <n-dropdown trigger="click" :options="options">
          <n-button tertiary type="primary"> 分栏 </n-button>
        </n-dropdown>
        <n-dropdown trigger="click" :options="options">
          <n-button tertiary type="primary"> 选项 </n-button>
        </n-dropdown>
        <n-dropdown trigger="click" :options="options">
          <n-button tertiary type="primary"> 导出 </n-button>
        </n-dropdown>
      </n-button-group>
      <n-button tertiary size="tiny" type="info" @click="updateData">
        更新状态
      </n-button>
    </n-flex>
    <vxe-table
      style="flex: 1"
      :data="sortedData"
      @sort-change="handleSort"
      @checkbox-all="handleCheckboxChange"
      @checkbox-change="handleCheckboxChange"
      size="mini"
      round
      auto-resize
      height="auto"
      :scroll-y="{ enabled: true, gt: 0 }"
      :row-config="{ drag: true }"
      :row-drag-config="{
        showIcon: false,
        trigger: 'cell',
        showGuidesStatus: false,
      }"
      resizable
      :resizable-config="{
        dragMode: 'fixed',
        isDblclickAutoWidth: true,
      }"
      :sort-config="{
        trigger: 'cell',
        orders: ['asc', 'desc'],
        defaultSort: {
          field: 'path',
          order: 'asc',
        },
      }"
      :checkbox-config="{
        labelField: 'state',
        highlight: true,
        range: true,
        trigger: 'cell',
      }"
    >
      <!-- <vxe-column type="seq" width="70"  ></vxe-column> -->
      <vxe-column
        field="state"
        title="状态"
        type="checkbox"
        width="auto"
        sortable
        sort-type="string"
      ></vxe-column>
      <vxe-column field="key" title="#" width="auto"></vxe-column>
      <vxe-column field="index" title="序号" width="auto"></vxe-column>
      <vxe-column
        field="name"
        title="名称"
        sort-type="string"
        sortable
        width="auto"
        drag-sort
      ></vxe-column>
      <vxe-column
        field="newName"
        title="新名称"
        sort-type="string"
        sortable
        width="auto"
      ></vxe-column>
      <vxe-column
        field="path"
        title="路径"
        sort-type="string"
        sortable
      ></vxe-column>
    </vxe-table>
  </n-flex>
</template>

<script setup lang="ts">
import type {
  DataTableColumns,
  // DataTableInst,
  DataTableSortState,
} from "naive-ui";
import { NCheckbox } from "naive-ui";
import type { HTMLAttributes } from "vue";
import {
  h,
  ref,
  reactive,
  computed,
  onMounted,
  defineModel,
  defineEmits,
  watch,
  isReactive,
  isRef,
} from "vue";
import { naturalCompare } from "@/utils/common";
import type { RowData } from "@/interface/ListDataTable";
import { ArrowForwardCircleSharp, Warning } from "@vicons/ionicons5";
import type {
  VxeTableComponent,
  VxeTableEvents,
  VxeTableDefines,
} from "vxe-table";

const options = [
  {
    label: "选项1",
    key: "option1",
    disabled: true,
  },
  {
    label: "选项2",
    key: "option2",
  },
  {
    label: "选项3",
    key: "option3",
  },
  {
    label: "选项4",
    key: "option4",
  },
];

const data = defineModel("data", { type: Array<RowData>, default: [] });
const sorter = ref<VxeTableDefines.SortChangeEventParams | null>(null);
const listSelected = reactive<number[]>([]);

// 最近一次鼠标点击的行的Key(只有鼠标单击或按住Ctrl单击时会记录)
let currentClickKey: number | null = null;

function rowProps(row: RowData, rowIndex: number): HTMLAttributes {
  return {
    onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.classList.value.includes("n-checkbox-box__border")) return;
      if (e.ctrlKey) {
        currentClickKey = row.key;
        if (!listSelected.includes(row.key)) {
          listSelected.push(row.key);
        } else {
          const index = listSelected.findIndex((x) => x === row.key);
          listSelected.splice(index, 1);
        }
      } else if (e.shiftKey) {
        if (listSelected.length < 1) {
          listSelected.push(row.key);
        } else {
          const currentIndex = sortedData.value.findIndex(
            (x) => x.key === currentClickKey
          );
          const targetIndex = sortedData.value.findIndex(
            (x) => x.key === row.key
          );
          const firstIndex = Math.min(currentIndex, targetIndex);
          const latestIndex = Math.max(currentIndex, targetIndex);
          console.log(currentIndex, targetIndex);
          listSelected.splice(0);
          listSelected.push(
            ...sortedData.value
              .filter((x, index) => index >= firstIndex && index <= latestIndex)
              .map((x) => x.key)
          );
        }
      } else {
        currentClickKey = row.key;
        listSelected.splice(0);
        listSelected.push(row.key);
      }

      console.log(listSelected);
    },
  };
}

function rowClassName(rowData: RowData) {
  if (listSelected.includes(rowData.key)) {
    return "row-selected";
  }
  return "";
}

const handleSort: VxeTableEvents.SortChange = (params) => {
  console.log("sort变化", params);
  sorter.value = params;
};

//j 排序后的数据
const sortedData = computed<RowData[]>(() => {
  if (sorter.value == null) return [...data.value];
  const { field, order } = sorter.value;
  return [...data.value].sort((a, b) => {
    let a_key = a[field] as unknown as string;
    let b_key = b[field] as unknown as string;

    if (field === "state") {
      a_key = String(a.isSelected) + a.state;
      b_key = String(b.isSelected) + b.state;
    }

    if (order === "asc") {
      return naturalCompare(a_key, b_key);
    } else if (order === "desc") {
      return naturalCompare(b_key, a_key);
    } else {
      return 0;
    }
  });
});

const handleCheckboxChange:
  | VxeTableEvents.CheckboxChange
  | VxeTableEvents.CheckboxAll = (params) => {
  console.log("checkbox变化", params);
};

const emits = defineEmits<{
  update: (data: RowData[]) => void;
}>();
// 更新data数据
function updateData() {
  console.log("更新数据：", sortedData.value);
  data.value = [...sortedData.value];
}
</script>

<style lang="scss" scoped>
:deep(.row-selected td) {
  background: #0078d7 !important;
  color: black;
}
:deep(*) {
  user-select: none;
}
</style>
