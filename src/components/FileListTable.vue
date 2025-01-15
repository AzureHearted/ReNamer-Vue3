<template>
  <n-flex
    vertical
    :size="0"
    style="overflow: hidden"
    @dragover.prevent.stop="onDragOver"
    @drop.prevent.stop="onDrop"
  >
    <n-flex style="flex: 0 0 26px">
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
    <n-flex vertical :size="0" style="flex: 1">
      <n-data-table
        style="flex: 1"
        size="small"
        :columns="columns"
        :data="sortedData"
        :single-line="false"
        flex-height
        virtual-scroll
        :row-props="rowProps"
        :row-class-name="rowClassName"
        @update:sorter="handleSort"
      />
      <n-flex size="small" style="flex: 0 0 26px">
        <n-flex :size="0" style="width: 250px">
          {{ data?.length }}个文件
        </n-flex>
      </n-flex>
    </n-flex>
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
import { buildUUID, naturalCompare } from "@/utils/common";
import type { RowData } from "@/interface/ListDataTable";
import { ArrowForwardCircleSharp, Warning } from "@vicons/ionicons5";

//s 选项定义
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

//s 数据列定义
const columns: DataTableColumns<RowData> = [
  {
    key: "state",
    width: 70,
    fixed: "left",
    title: "状态",
    render(rowData) {
      return h("div", { style: "display: flex;align-items: center;gap:2px;" }, [
        h(NCheckbox, {
          checked: rowData.isSelected,
          onUpdateChecked: () => (rowData.isSelected = !rowData.isSelected),
        }),
        rowData.state === "ok"
          ? h(ArrowForwardCircleSharp, {
              style: "color:#9bc000;width: 16px;height: 16px;",
            })
          : rowData.state === "conflict"
          ? h(Warning, { style: "color:#ffc63a;width: 16px;height: 16px;" })
          : null,
      ]);
    },
    sorter: (r1, r2) => {
      const compareStr1 = String(r1.isSelected) + r1.state;
      const compareStr2 = String(r2.isSelected) + r2.state;
      console.log("排序", compareStr1, compareStr2);
      return naturalCompare(compareStr1, compareStr2);
    },
  },
  {
    title: "#",
    key: "index",
    width: 50,
    fixed: "left",
    render(rowData, rowIndex) {
      return rowIndex + 1;
    },
  },
  {
    title: "ID",
    key: "key",
    width: 50,
    fixed: "left",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "名称",
    key: "name",
    resizable: true,
    width: 150,
    minWidth: 120,
    maxWidth: 400,
    fixed: "left",
    ellipsis: {
      tooltip: true,
    },
    sorter: (r1, r2) => naturalCompare(r1.name, r2.name),
  },
  {
    title: "新名称",
    key: "newName",
    resizable: true,
    width: 150,
    minWidth: 120,
    maxWidth: 400,
    ellipsis: {
      tooltip: true,
    },
    sorter: (r1, r2) => naturalCompare(r1.name, r2.name),
  },
  {
    title: "路径",
    key: "path",
    minWidth: 100,
    maxWidth: 500,
    ellipsis: {
      tooltip: true,
    },
    sorter: (r1, r2) => naturalCompare(r1.name, r2.name),
  },
];

//s 初始数据
const data = defineModel("data", { type: Array<RowData>, default: [] });

//s 排序器
const sorter = ref<DataTableSortState | null>(null);

//j 排序后的数据
const sortedData = computed<RowData[]>(() => {
  if (sorter.value == null) return [...data.value];
  const { columnKey, order } = sorter.value;
  return [...data.value].sort((a, b) => {
    let a_key = a[columnKey] as unknown as string;
    let b_key = b[columnKey] as unknown as string;

    if (columnKey === "state") {
      a_key = String(a.isSelected) + a.state;
      b_key = String(b.isSelected) + b.state;
    }

    if (order === "ascend") {
      return naturalCompare(a_key, b_key);
    } else if (order === "descend") {
      return naturalCompare(b_key, a_key);
    } else {
      return 0;
    }
  });
});

//s 最近一次鼠标点击的行的Key(只有鼠标单击或按住Ctrl单击时会记录)
let currentClickKey: string | null = null;

//s 选中列的Key列表
const listSelected = reactive<string[]>([]);

//f 自定义属性
function rowProps(row: RowData, rowIndex: number): HTMLAttributes {
  return {
    // 点击列时的事件
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

//f 列的类名定义
function rowClassName(rowData: RowData) {
  if (listSelected.includes(rowData.key)) {
    return "row-selected";
  }
  return "";
}

//f 发生排序时的回调
function handleSort(sortInfo: DataTableSortState) {
  console.log("发生排序", sortInfo);
  sorter.value = sortInfo;
}

const emits = defineEmits<{
  update: (data: RowData[]) => void;
}>();

//f 更新data数据(初始数据)
function updateData() {
  console.log("更新数据：", sortedData.value);
  data.value = [...sortedData.value];
}

function onDragOver(e: DragEvent) {
  // console.log("dragOver");
}

async function onDrop(e: DragEvent) {
  // 检查拖拽数据
  if (!e.dataTransfer || !e.dataTransfer.items) return;

  const items = Array.from(e.dataTransfer.items); // 获取拖拽项
  const newFiles: RowData[] = [];

  for (const item of items) {
    const entry = item.webkitGetAsEntry?.(); // 获取文件或文件夹入口
    if (entry) {
      await traverseFileTree(entry, "", newFiles); // 遍历文件夹
    }
  }

  // 将文件信息推入数据中
  data.value.push(...newFiles);
}

/**
 * 递归遍历文件夹内容
 */
function traverseFileTree(
  entry: FileSystemEntry,
  path: string,
  files: RowData[]
): Promise<void> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      // 处理文件
      (entry as FileSystemFileEntry).file((file) => {
        files.push({
          key: buildUUID(),
          name: file.name,
          newName: file.name,
          path: path + file.name, // 构建完整路径
          state: "ok",
        });
        resolve();
      });
    } else if (entry.isDirectory) {
      // 处理文件夹
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      dirReader.readEntries(async (entries) => {
        for (const subEntry of entries) {
          await traverseFileTree(subEntry, path + entry.name + "/", files); // 递归
        }
        resolve();
      });
    } else {
      resolve(); // 非文件或文件夹，直接跳过
    }
  });
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
.drag-zone {
  position: absolute;
  background-color: wheat;
  width: 100px;
  height: 100px;
  z-index: 1000;
}
</style>
