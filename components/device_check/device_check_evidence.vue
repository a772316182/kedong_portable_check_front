<script setup lang="ts">
interface Props {
  evidenceTitle?: string;
}
const props = withDefaults(defineProps<Props>(), {
  evidenceTitle: "",
});
// 定义 emit
const emit = defineEmits(["cancel"]);

// 表单数据
const columns = {
  index: "编号",
  checkItem: "核查项",
  checkItemType: "核查项类型",
  checkResult: "核查结果",
  explanation: "核查结果说明",
  evidence: "取证结果",
  supplement: "补充取证",
  actions: "操作",
};

const rows: {
  index: number;
  checkItem: string;
  checkItemType: string;
  checkResult: string;
  explanation: string;
  evidence: string;
  supplement: string;
}[] = [
  {
    index: 1,
    checkItem: "基线核查",
    checkItemType: "安全配置",
    checkResult: "不合格",
    explanation: "发现3项不合规配置",
    evidence: "配置截图.zip",
    supplement: "需要补充系统日志",
  },
  {
    index: 2,
    checkItem: "高危端口",
    checkItemType: "网络扫描",
    checkResult: "合格",
    explanation: "所有端口符合安全标准",
    evidence: "端口扫描报告.pdf",
    supplement: "无需补充",
  },
  {
    index: 3,
    checkItem: "弱口令扫描",
    checkItemType: "账户安全",
    checkResult: "不合格",
    explanation: "发现2个弱口令账户",
    evidence: "账户列表.csv",
    supplement: "需要补充修改记录",
  },
  {
    index: 4,
    checkItem: "漏洞扫描",
    checkItemType: "系统漏洞",
    checkResult: "进行中",
    explanation: "扫描进行中，已完成70%",
    evidence: "初步报告.pdf",
    supplement: "待扫描完成后确认",
  },
  {
    index: 5,
    checkItem: "违规外联",
    checkItemType: "网络行为",
    checkResult: "合格",
    explanation: "未检测到非法外联行为",
    evidence: "网络日志.rar",
    supplement: "无需补充",
  },
  {
    index: 6,
    checkItem: "恶意代码部署情况",
    checkItemType: "恶意软件",
    checkResult: "不合格",
    explanation: "检测到可疑执行文件",
    evidence: "样本文件.zip",
    supplement: "需要补充行为分析",
  },
];

// 取消按钮点击
function onCancel() {
  emit("cancel");
}
</script>

<template>
  <q-card bordered flat style="min-width: 70%">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">
        {{ "网络配置核查结果" }}
      </div>
      <q-space />
      <q-btn
        flat
        round
        dense
        icon="close"
        @click="onCancel"
        class="q-ml-auto text-grey-7"
      />
    </q-card-section>
    <q-card-section>
      <common-enhanced-table
        :rows="rows"
        :column-labels="columns"
        row-key="index"
        :non-searchable-columns="[
          'index',
          'actions',
          'explanation',
          'supplement',
        ]"
        :non-sortable-columns="['actions']"
      >
        <template #cell-checkResult="{ row }">
          <common-status-chip :label="row.checkResult" />
        </template>
        <template #cell-actions>
          <q-btn flat color="primary">上传附件</q-btn>
          <q-btn flat color="red-10">删除附件</q-btn>
        </template>
      </common-enhanced-table>
    </q-card-section>
  </q-card>
</template>
