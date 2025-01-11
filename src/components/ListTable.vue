<template>
  <n-flex vertical :size="0" style="height: 100%; padding-top: 2px">
    <n-button-group size="tiny" style="height: 26px">
      <n-dropdown trigger="click" :options="options">
        <n-button tertiary ghost type="primary"> 文件 </n-button>
      </n-dropdown>
      <n-dropdown trigger="click" :options="options">
        <n-button tertiary ghost type="primary"> 分栏 </n-button>
      </n-dropdown>
      <n-dropdown trigger="click" :options="options">
        <n-button tertiary ghost type="primary"> 选项 </n-button>
      </n-dropdown>
      <n-dropdown trigger="click" :options="options">
        <n-button tertiary ghost type="primary"> 导出 </n-button>
      </n-dropdown>
    </n-button-group>
    <n-data-table
      ref="tableRef"
      size="small"
      :columns="columns"
      :data="data"
      :single-line="false"
      flex-height
      virtual-scroll
      :row-props="rowProps"
      :row-class-name="rowClassName"
      style="flex: 1"
    />
    <n-flex size="small" style="height: 26px">
      <n-flex :size="0" style="width: 250px"> 过滤指示器 </n-flex>
      {{}}个文件
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import type { DataTableColumns, DataTableInst } from "naive-ui";
import { NCheckbox } from "naive-ui";
import type { HTMLAttributes } from "vue";
import { h, ref, reactive, onMounted, watch, isReactive, isRef } from "vue";
import { naturalCompare } from "@/utils/common";
import { ArrowForwardCircleSharp, Warning } from "@vicons/ionicons5";

const options = [
  {
    label: "滨海湾金沙，新加坡",
    key: "marina bay sands",
    disabled: true,
  },
  {
    label: "布朗酒店，伦敦",
    key: "brown's hotel, london",
  },
  {
    label: "亚特兰蒂斯巴哈马，拿骚",
    key: "atlantis nahamas, nassau",
  },
  {
    label: "比佛利山庄酒店，洛杉矶",
    key: "the beverly hills hotel, los angeles",
  },
];

interface DataTableInst {
  $refs: {
    mainTableInstRef: {
      bodyInstRef: {
        $refs: {
          virtualListRef: {
            items: { tmNode: { rawNode: RowData } }[]; // 请根据实际数据结构修改
          };
        };
      };
      getBodyElement(): void;
    };
  };
}

const tableRef = ref<DataTableInst>();
onMounted(() => {
  // let reallyData = reactive(data);
  const innerRef = tableRef.value?.$refs.mainTableInstRef.bodyInstRef.$refs.virtualListRef;
  console.log(innerRef, isReactive(innerRef), isRef(innerRef));
  // watch([innerRef.value], () => {
  //   console.log(innerRef);
  // });
  // watch(
  //   [tableRef.value!.$refs.mainTableInstRef.bodyInstRef.virtualListRef],
  //   (data) => {
  //     reallyData = data.items.map<RowData>((x) => x.tmNode.rawNode);
  //     console.log(reallyData);
  //   }
  // );
});

//i 列表项数据格式
interface RowData {
  key: number;
  index: number;
  path: string;
  name: string;
  newName: string;
  state: "ok" | "conflict" | "error";
  isSelected: boolean;
}

// 列的定义
const columns: DataTableColumns<RowData> = [
  {
    key: "isSelected",
    width: 50,
    fixed: "left",
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
  },
  {
    title: "#",
    key: "index",
    width: 50,
    fixed: "left",
    render(rowData, rowIndex) {
      return rowIndex;
    },
  },
  {
    title: "ID",
    key: "key",
    width: 50,
    fixed: "left",
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

const data: RowData[] = reactive(
  Array.from({ length: 500 }).map((_, index) => ({
    key: index,
    index,
    path: `${index}`,
    name: `Edward King ${index}`,
    newName: `${index * 32}`,
    isSelected: true,
    state: "ok",
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
        }
      } else {
        listSelected.splice(0);
        listSelected.push(rowData.key);
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
</script>

<style lang="scss" scoped>
:deep(.row-selected td) {
  background: #0078d7 !important;
  color: black;
}
</style>
