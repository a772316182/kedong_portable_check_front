<script setup lang="ts">
import { reactive, ref, onMounted, defineProps } from "vue";
import { useQuasar } from 'quasar';
import { type Nodes, type Edges, type Layouts, type VNetworkGraphInstance, VNetworkGraph, type EventHandlers, type ViewMode, type NodeEvent, type EdgeEvent } from "v-network-graph";
import graphData from "../../pages/data";
import { useTopologyApi } from '~/composables/useApi';
import type { TopologyData } from "~/types/api";

const props = defineProps<{
  stationId: string;
}>();


const $q = useQuasar();
const { getTopology, saveTopology, getState, saveState } = useTopologyApi();
const isBoxSelectionMode = ref(false)

const graph = ref<VNetworkGraphInstance>()
const selectionBox = reactive({
  active: false,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0
});
const DEVICE_IMAGES = {
  ROUTER: "/images/router.jpg",
  LAPTOP: "/images/table.jpg",
  SERVER: "/images/table.jpg",
  SWITCH: "/images/switch.png",
  FIREWALL: "/images/table.jpg",
  TABLET: "/images/table.jpg",
} as const;

type DeviceType = keyof typeof DEVICE_IMAGES;

const nodes: Nodes = reactive({});
const layouts = reactive<Layouts>({ nodes: {} });

function calculateLayout(nodeIds: string[]) {
  const centerX = 300;
  const width = 500;
  const verticalSpacing = 150;

  const nodeGroups: Record<string, string[]> = {
    ROUTER: [],
    SWITCH: [],
    OTHER: []
  };

  nodeIds.forEach(id => {
    if (!layouts.nodes[id]) {
      const nodeType = nodes[id]?.type?.toUpperCase();
      if (nodeType === 'ROUTER') {
        nodeGroups.ROUTER.push(id);
      } else if (nodeType === 'SWITCH') {
        nodeGroups.SWITCH.push(id);
      } else {
        nodeGroups.OTHER.push(id);
      }
    }
  });

  Object.entries(nodeGroups).forEach(([group, groupNodes]) => {
    if (groupNodes.length === 0) return;

    let yPos: number;
    switch (group) {
      case 'ROUTER':
        yPos = 150;
        break;
      case 'SWITCH':
        yPos = 300;
        break;
      default:
        yPos = 450;
    }

    const horizontalSpacing = 100;
    groupNodes.forEach((nodeId, index) => {
      layouts.nodes[nodeId] = {
        x: centerX - width/2 + (index + 1) * horizontalSpacing,
        y: yPos
      };
    });
  });
}

function initializeGraph(topology: TopologyData) {
  Object.keys(nodes).forEach(k => delete nodes[k]);
  Object.keys(edges).forEach(k => delete edges[k]);
  Object.keys(layouts.nodes).forEach(k => delete layouts.nodes[k]);

  for (const [nodeId, nodeInfo] of Object.entries(topology.nodes)) {
    const deviceType = nodeInfo.type?.toUpperCase() || 'LAPTOP';
    const deviceImage = DEVICE_IMAGES[deviceType as DeviceType] || DEVICE_IMAGES.LAPTOP;

    nodes[nodeId] = {
      name: nodeInfo.name,
      image: deviceImage,
      type: deviceType
    };

    if (nodeInfo.x !== undefined && nodeInfo.y !== undefined) {
      layouts.nodes[nodeId] = { x: nodeInfo.x, y: nodeInfo.y };
    }
  }

  for (const [edgeId, edgeInfo] of Object.entries(topology.edges)) {
    edges[edgeId] = { source: edgeInfo.source, target: edgeInfo.target };
  }

  calculateLayout(Object.keys(topology.nodes));

  nextNodeIndex.value = Object.keys(nodes).length + 1;
  nextEdgeIndex.value = Object.keys(edges).length + 1;
}

onMounted(() => {
  loadTopology();
});

const edges = reactive<Edges>({});

const nextNodeIndex = ref(1);
const nextEdgeIndex = ref(1);

const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);

const selectedDeviceType = ref<DeviceType>("LAPTOP");

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`;
  const name = `N${nextNodeIndex.value}`;
  nodes[nodeId] = {
    name,
    image: DEVICE_IMAGES[selectedDeviceType.value],
    type: selectedDeviceType.value
  };

  const centerX = 300;
  const centerY = 300;
  layouts.nodes[nodeId] = {
    x: centerX + Math.random() * 200 - 100,
    y: centerY + Math.random() * 200 - 100
  };

  nextNodeIndex.value++;
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    Object.entries(edges).forEach(([edgeId, edge]) => {
      if (edge.source === nodeId || edge.target === nodeId) {
        delete edges[edgeId];
      }
    });

    delete nodes[nodeId];
    delete layouts.nodes[nodeId];
  }
  selectedNodes.value = [];
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return;

  const [source, target] = selectedNodes.value;
  const edgeId = `edge${nextEdgeIndex.value}`;
  edges[edgeId] = { source, target };
  nextEdgeIndex.value++;
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete edges[edgeId];
  }
  selectedEdges.value = [];
}

function clearSelection() {
  selectedNodes.value = [];
  selectedEdges.value = [];
}

const editingNodeId = ref<string | null>(null);
const newNodeName = ref('');

const eventHandlers: EventHandlers = {
  "node:click": ({ node, event }: NodeEvent<MouseEvent>) => {
    if (event.ctrlKey) {
      const index = selectedNodes.value.indexOf(node);
      if (index >= 0) {
        selectedNodes.value.splice(index, 1);
      } else {
        selectedNodes.value.push(node);
      }
    } else {
      selectedNodes.value = [node];
      selectedEdges.value = [];
    }
  },
  "edge:click": ({ edge, event }: EdgeEvent<MouseEvent>) => {
    if (!edge) return;
    if (event.ctrlKey) {
      const index = selectedEdges.value.indexOf(edge);
      if (index >= 0) {
        selectedEdges.value.splice(index, 1);
      } else {
        selectedEdges.value.push(edge);
      }
    } else {
      selectedEdges.value = [edge];
      selectedNodes.value = [];
    }
  },
  "view:click": () => {
    clearSelection();
  },
  "node:dblclick": ({ node }: { node: string }) => {
    editingNodeId.value = node;
    newNodeName.value = nodes[node].name ?? '';
  },
  "box-selection:end": ({ nodes: boxSelectedNodes }: { nodes: string[] }) => {
    boxSelectedNodes.forEach(nodeId => {
      if (!selectedNodes.value.includes(nodeId)) {
        selectedNodes.value.push(nodeId);
      }
    });
  },
  "view:mode": (mode: ViewMode) => {
    isBoxSelectionMode.value = mode === "box-selection"
  },
} as any;

function saveNodeName() {
  if (editingNodeId.value) {
    nodes[editingNodeId.value].name = newNodeName.value;
    editingNodeId.value = null;
    newNodeName.value = '';
  }
}

function startBoxSelection() {
  graph.value?.startBoxSelection()
}

function cancelEdit() {
  editingNodeId.value = null;
  newNodeName.value = '';
}

async function handleSaveTopology() {
  try {
    const layoutedNodes: { [id: string]: any } = {};
    for (const [nodeId, nodeData] of Object.entries(nodes)) {
        const layout = layouts.nodes[nodeId];
        layoutedNodes[nodeId] = {
            ...nodeData, // name, image, type
            ips: [nodeData.name || nodeId], // Simplified, assumes name is IP or unique ID
            ports: [], // Placeholder, needs logic if port data is available
            x: layout?.x,
            y: layout?.y,
        };
    }
    
    const currentTopologyState: TopologyData = {
        nodes: layoutedNodes,
        edges: edges,
        subnets: [], // Placeholder
        ports: [] // Placeholder
    };

    const response = await saveTopology({
      stationId: props.stationId,
      topology_json: JSON.stringify(currentTopologyState)
    });

    if (response.retNum === 0) {
      $q.notify({
        color: 'positive',
        message: '拓扑保存成功！'
      });
    } else {
      throw new Error(response.errMessage || '保存失败');
    }
  } catch (error: any) {
    $q.notify({
      color: 'negative',
      message: `拓扑保存失败: ${error.message}`
    });
    console.error(error);
  }
}

async function loadTopology() {
  try {
    const response = await getTopology({ stationId: props.stationId });
    if(response && response.retNum === 0 && response.topology_json) {
        const reloadedTopo = JSON.parse(response.topology_json);
        initializeGraph(reloadedTopo);
        $q.notify({
        color: 'positive',
        message: '拓扑加载成功！'
        });
    } else if (response.retNum !== 0) {
       throw new Error(response.errMessage || '获取拓扑数据失败');
    } else {
        initializeGraph({ nodes: {}, edges: {}, subnets: [], ports: [] });
        $q.notify({
            color: 'info',
            message: '该厂站暂无拓扑数据，已为您初始化。'
        });
    }
  } catch (error: any) {
    $q.notify({
      color: 'negative',
      message: `拓扑加载失败: ${error.message}`
    });
    console.error(error);
    initializeGraph({ nodes: {}, edges: {}, subnets: [], ports: [] });
  }
}
</script>

<template>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="text-h6">网络拓扑编辑器</div>
            <p class="text-body2 text-grey-8">
                根据已有的资产和网络信息，自动或手动绘制网络拓扑图。拓扑图可以直观地展示设备间的连接关系。
            </p>
          </div>
          <div class="col-12">
            <div class="row q-col-gutter-sm items-center">
              <div class="col-auto">
                <q-select
                    v-model="selectedDeviceType"
                    :options="Object.keys(DEVICE_IMAGES)"
                    label="设备类型"
                    dense
                    outlined
                    style="width: 150px"
                />
              </div>
              <div class="col-auto">
                <q-btn color="primary" label="添加节点" @click="addNode" />
              </div>
              <div class="col-auto">
                <q-btn
                    color="negative"
                    label="删除节点"
                    :disable="selectedNodes.length === 0"
                    @click="removeNode"
                />
              </div>
              <div class="col-auto">
                <q-btn
                    color="primary"
                    label="添加连接"
                    :disable="selectedNodes.length !== 2"
                    @click="addEdge"
                />
              </div>
              <div class="col-auto">
                <q-btn
                    color="negative"
                    label="删除连接"
                    :disable="selectedEdges.length === 0"
                    @click="removeEdge"
                />
              </div>
              <div class="col-auto">
                <q-btn
                    color="secondary"
                    label="清除选择"
                    :disable="selectedNodes.length === 0 && selectedEdges.length === 0"
                    @click="clearSelection"
                />
              </div>
              <div class="col-auto">
                <q-btn
                    color="primary"
                    :label="isBoxSelectionMode ? '退出框选模式' : '进入框选模式'"
                    :outline="!isBoxSelectionMode"
                    @click="startBoxSelection"
                />
              </div>
              <div class="col-auto">
                <q-btn color="positive" label="保存拓扑" @click="handleSaveTopology" :loading="saveState.loading" />
              </div>
              <div class="col-auto">
                <q-btn color="info" label="重新加载" @click="loadTopology" :loading="getState.loading" />
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-12">
                <q-badge color="primary" v-if="selectedNodes.length > 0">
                  已选择节点: {{ selectedNodes.join(', ') }}
                </q-badge>
                <q-badge color="secondary" class="q-ml-sm" v-if="selectedEdges.length > 0">
                  已选择连接: {{ selectedEdges.join(', ') }}
                </q-badge>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <v-network-graph
            ref="graph"
            :nodes="nodes"
            :edges="edges"
            :layouts="layouts"
            :configs="graphData.configs"
            :event-handlers="eventHandlers"
            :selected-nodes="selectedNodes"
            :selected-edges="selectedEdges"
            class="graph"
        >
          <defs>
            <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
              <circle cx="0.5" cy="0.5" r="0.5" />
            </clipPath>
          </defs>

          <template #override-node="{ nodeId, scale, config, ...slotProps }">
            <g v-bind="slotProps">
              <circle
                  v-if="config.color"
                  :r="config.radius * scale"
                  class="node-bg"
                  stroke="#333"
                  stroke-width="1"
              />

              <image
                  :href="nodes[nodeId]?.image"
                  :x="-config.radius * scale"
                  :y="-config.radius * scale"
                  :width="config.radius * scale*2"
                  :height="config.radius * scale*2"
                  preserveAspectRatio="xMidYMid meet"
                  clip-path="url(#faceCircle)"
              />
            </g>
          </template>

          <template #svg-overlay>
            <foreignObject
                v-if="editingNodeId"
                x="50"
                y="50"
                width="150"
                height="80"
                style="overflow: visible"
            >
              <div class="node-edit-container">
                <q-input
                    v-model="newNodeName"
                    dense
                    outlined
                    autofocus
                    @keyup.enter="saveNodeName"
                    @keyup.esc="cancelEdit"
                />
                <div class="row q-mt-sm justify-end">
                  <q-btn
                      size="sm"
                      color="positive"
                      label="保存"
                      @click="saveNodeName"
                  />
                  <q-btn
                      size="sm"
                      color="negative"
                      label="取消"
                      class="q-ml-sm"
                      @click="cancelEdit"
                  />
                </div>
              </div>
            </foreignObject>
          </template>
        </v-network-graph>
      </q-card-section>
    </q-card>
</template>

<style scoped>
.node-bg {
  fill: white;
}
.graph {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
.selected-node circle {
  stroke: #FF5722 !important;
  stroke-width: 2px !important;
  filter: drop-shadow(0 0 4px rgba(255, 87, 34, 0.6));
}
.node-edit-container {
  background-color: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.mode {
  position: absolute;
  bottom: 10px;
  left: 10px;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 14px;
  color: #ffffff;
  background-color: #317dc9;
  font-style: italic;
  pointer-events: none;
}
</style> 