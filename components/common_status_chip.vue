<script setup lang="ts">
interface Props {
  label: string;
  isAutoColor?: boolean;
  color?: "indigo-10" | "orange-10" | "green-10" | "red-10";
}

const props = withDefaults(defineProps<Props>(), {
  isAutoColor: true,
  color: "indigo-10",
});

const color = computed(() => {
  if (props.isAutoColor) {
    switch (props.label) {
      case "未核查":
        return "grey-10";
      case "未完成":
        return "indigo-10";
      case "已完成":
        return "green-10";
      case "异常":
        return "red-10";
      case "进行中":
        return "orange-10";
      case "合格":
        return "green-10";
      case "待处理":
        return "orange-10";
      case "处理中":
        return "orange-10";
      case "处理完成":
        return "green-10";
      case "处理失败":
        return "red-10";
      case "不合格":
        return "red-10";
      default:
        return "indigo-10";
    }
  } else return props.color;
});
const emit = defineEmits(["click"]);
</script>

<template>
  <q-chip
    outline
    square
    :color="color"
    dense
    clickable
    text-color="white"
    :label="label"
    @click="emit('click')"
  />
</template>

<style scoped></style>
