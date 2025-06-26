import { defineConfigs } from "v-network-graph";
import type { Edges, Layouts } from "v-network-graph";
import topo from "./topology.json";

// 1) 构建 edges 直接映射 topology.json 中的 edges
export const edges: Edges = {};
for (const [eid, e] of Object.entries(topo.edges)) {
    edges[eid] = { source: e.source, target: e.target };
}

// 2) 布局将在组件中动态生成
export const layouts: Layouts = {
    nodes: {},
};

// 3) 配置项
export const configs = defineConfigs({
    view: {
      autoPanAndZoomOnLoad: "fit-content",
      selection: {
        enabled: true,  // 启用选择功能
        multiple: true,  // 允许多选
        rubberband: true,  // 启用框选
        box: {
          color: "#0000ff20",
          strokeWidth: 1,
          strokeColor: "#aaaaff",
          strokeDasharray: "0",
        },
      },
    },
    node: {
      selectable: true,  // 节点可被选择
      selectionDisabled: false,  // 确保选择未被禁用
      normal: {
        radius: 20,
        color: "#006a6a",
      },
      hover: {
        radius: 22,
        color: "#1c6b43",
      },
      // 移除 boxSelectionEnabled 配置，因为它应该在 view.selection 中配置
    },
    edge: {
      selectable: true,
      normal: {
        color: "#2c3e50",
        width: 2,
      },
      hover: {
        color: "#21BA45",
        width: 3,
      },
      selected: {
        color: "#C10015",
        width: 4,
      },
      margin: 4,
    },
  });

export default {
    edges,
    layouts,
    configs
};