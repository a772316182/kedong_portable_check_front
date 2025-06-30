<script setup lang="ts">
interface Props {
  label: string
  isAutoColor?: boolean
  color?: 'indigo-10' | 'orange-10' | 'green-10' | 'red-10'
}

const props = withDefaults(defineProps<Props>(), {
  isAutoColor: true,
  color: 'indigo-10'
})

const color = computed(() => {
  if (props.isAutoColor) {
    switch (props.label) {
      case '已完成':
        return 'green-10'
      case '异常':
        return 'red-10'
      case '进行中':
        return 'orange-10'
      case '合格':
        return 'green-10'
      case '待处理':
        return 'orange-10'
      case '处理中':
        return 'orange-10'
      case '处理完成':
        return 'green-10'
      case '处理失败':
        return 'red-10'
      case '不合格':
        return 'red-10'
      default:
        return 'indigo-10'
    }
  } else return props.color
})
</script>

<template>
  <q-chip outline square :color=color dense text-color="white" :label="label"/>
</template>

<style scoped>

</style>