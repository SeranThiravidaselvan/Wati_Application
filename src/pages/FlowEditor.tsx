import { useCallback, useState, useRef, useEffect, useContext } from 'react';
import ReactFlow, {
   Background,
   Controls,
   Edge,
   Node,
   ConnectionLineType,
   useNodesState,
   useEdgesState,
   Position,
   useReactFlow,
   OnConnectEnd,
   OnConnectStart,
   MiniMap,
   BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MessageNode, QuestionNode } from '../components/CustomNodes/CustomNode';
import { http } from '../services/http.service';
import {
   deleteFlowStepNode,
   getFlowEdgeData,
   getFlowNodeData,
   postFlowStepEdge,
   postFlowStepNode,
   putFlowStepNode,
} from '../services/FlowEditor Services/http.flowservice';
import { flowEdge, getFlowNodeModel, MessageNodeData, MessageNodeModel, sourceNode } from '../types/NodeTypes';
import { MenuContext } from '../layout/context/menuProvider';

const nodeTypes = {
   MessageNode: MessageNode,
   QuestionNode: QuestionNode,
};
export const generateId = () => {
   return Math.random().toString(36).substring(2, 6);
};

const FlowEditor = () => {
   const flowId = location.pathname.split('/')[3];
   const { isNewNode, setIsNewNode } = useContext(MenuContext);

   useEffect(() => {
      nodeData();
   }, []);

   useEffect(() => {
      if (isNewNode) {
         newMsgNode();
         setIsNewNode(false);
      }
   }, [isNewNode]);

   const nodeData = async () => {
      const nodes: getFlowNodeModel[] | undefined = await getFlowNodeData(flowId);
      const nodeArray: MessageNodeModel[] = [];
      nodes?.map((nodeData) => {
         const nodeObj = {
            id: nodeData.node,
            type: nodeData?.type_name,
            position: nodeData.position,
            data: {
               ...nodeData.metadata,
               ...{
                  step_id: nodeData.id,
                  nextStep_id: nodeData.next_step_id,
                  step_order: nodeData.step_order,
                  deleteNode,
                  copyNode,
                  updateNodeData,
                  saveNodeData,
                  is_starting: nodeData.is_starting,
               },
            },
            sourcePosition: Position.Right,
         };
         nodeArray.push(nodeObj);
      });
      edgeData();
      setNodes(nodeArray);
   };

   const edgeData = async () => {
      const response: flowEdge[] | undefined = await getFlowEdgeData();
      const edgeArray: Edge[] = [];
      response?.map((edgeData) => {
         const edgeObj = {
            id: edgeData.edge_id,
            source: edgeData.source,
            target: edgeData.target,
            sourceHandle: edgeData.sourcehandle,
            targetHandle: edgeData.targethandle,
            data: {
               flowEdgeId: edgeData.id,
            },
         };
         edgeArray.push(edgeObj);
      });
      setEdges(edgeArray);
   };

   const getRandomPosition = () => {
      return {
         x: Math.floor(Math.random() * 501), // Random between 0 and 500
         y: Math.floor(Math.random() * (300 - 50 + 1)) + 50, // Random between 50 and 300
      };
   };

   const stepOrder = () => {
      const nodes = getNodes();
      if (nodes.length > 0) {
         const lastStepOrder = nodes[nodes.length - 1].data.step_order;
         return lastStepOrder + 1;
      }
      return 1;
   };

   const [nodes, setNodes, onNodesChange] = useNodesState([]);
   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

   const flowWrapperRef = useRef<HTMLDivElement>(null);
   const { screenToFlowPosition, getNodes, getNode } = useReactFlow();

   const [menuScreenPosition, setMenuScreenPosition] = useState<{ x: number; y: number } | null>(null);
   const [sourceNode, setSourceNode] = useState<sourceNode | null>();
   const [isEdgeDropped, setIsEdgeDropped] = useState(false);

   const MENU_WIDTH = 220;
   const MENU_HEIGHT = 240;

   const onConnectStart: OnConnectStart = useCallback((_, params) => {
      setSourceNode(params);
   }, []);

   const onConnectEnd: OnConnectEnd = useCallback(
      async (event: MouseEvent | TouchEvent) => {
         setIsEdgeDropped(true);
         if (!sourceNode || !flowWrapperRef.current) return;

         const isConnected = edges.some(
            (edge) => edge.sourceHandle === sourceNode.handleId && edge.source === sourceNode.nodeId
         );
         if (isConnected) {
            setSourceNode(null);
            return;
         }

         const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
         const bounds = flowWrapperRef.current.getBoundingClientRect();

         const dropX = clientX - bounds.left;
         const dropY = clientY - bounds.top;

         // Convert screen coords to flow space
         const flowPos = screenToFlowPosition({ x: clientX, y: clientY });

         const THRESHOLD = 200;
         const nearest = nodes.find((node) => {
            if (node.id === sourceNode.nodeId) return false;
            const dx = node.position.x - flowPos.x;
            const dy = node.position.y - flowPos.y;
            return Math.sqrt(dx * dx + dy * dy) <= THRESHOLD;
         });

         if (nearest) {
            const newEdge: Edge = {
               id: `${sourceNode.nodeId}-${nearest.id}`,
               source: sourceNode.nodeId ? sourceNode.nodeId : '',
               target: nearest.id,
               sourceHandle: sourceNode.handleId,
               targetHandle: nearest.data.newTargetHandleId,
            };
            const flowEdgeBody = {
               edge_id: newEdge.id,
               source: newEdge.source,
               target: newEdge.target,
               sourcehandle: newEdge.sourceHandle,
               targethandle: newEdge.targetHandle,
            };

            const edgeResponse = await http.post(`create_edge`, JSON.stringify(flowEdgeBody));
            if (edgeResponse) {
               setEdges((edges) => [...edges, newEdge]);
               setSourceNode(null);
            }
            return;
         }

         const wrapperBounds = flowWrapperRef.current.getBoundingClientRect();
         const maxX = wrapperBounds.width - MENU_WIDTH - 10;
         const maxY = wrapperBounds.height - MENU_HEIGHT - 10;

         const clampedX = Math.max(0, Math.min(dropX, maxX));
         const clampedY = Math.max(0, Math.min(dropY, maxY));

         setMenuScreenPosition({ x: clampedX, y: clampedY });
      },
      [sourceNode, nodes, setEdges, setMenuScreenPosition]
   );

   const addNewNode = async (type: string) => {
      if (!sourceNode || !menuScreenPosition || !flowWrapperRef.current) return;
      if (!Object.keys(nodeTypes).includes(type)) {
         setMenuScreenPosition(null);
         setSourceNode(null);
         return;
      }
      const newNodeId = generateId();
      const newTargetHandleId = generateId();
      const newSourceHandleId = generateId();

      const sourceNodeData = getNode(sourceNode.nodeId ? sourceNode.nodeId : '');

      const bounds = flowWrapperRef.current.getBoundingClientRect();
      const absoluteX = bounds.left + menuScreenPosition.x;
      const absoluteY = bounds.top + menuScreenPosition.y;

      const flowPos = screenToFlowPosition({ x: absoluteX, y: absoluteY });

      const newNode: Node = {
         id: newNodeId,
         position: flowPos,
         type: type,
         data: {
            label: 'Send a message',
            buttons: [
               { label: 'Message' },
               { label: 'Image' },
               { label: 'Video' },
               { label: 'Audio' },
               { label: 'Document' },
            ],
            deleteNode,
            copyNode,
            updateNodeData,
            saveNodeData,
            newTargetHandleId,
            newSourceHandleId,
            step_order: stepOrder(),
         },
         sourcePosition: Position.Right,
         targetPosition: Position.Left,
      };
      const flowNodeBody = {
         type: newNode.type,
         step_order: newNode.data.step_order,
         metadata: newNode.data,
         node: newNode.id,
         is_starting: newNode.data.step_order === 1 ? true : false,
         next_step_id: null,
         position: newNode.position,
      };
      if (type === 'MessageNode') {
         const nodeResponse: { data: { id: number } } | undefined = await postFlowStepNode(flowId, flowNodeBody);
         if (nodeResponse) {
            const flowUpdateNode = {
               next_step_id: nodeResponse.data.id,
            };
            const sourceStepId = sourceNodeData?.data.step_id;
            const updateResponse = await putFlowStepNode(sourceStepId, flowUpdateNode);
            if (updateResponse) {
               newNode.data.step_id = nodeResponse.data.id;
               newNode.data.is_starting = flowNodeBody.is_starting;
               const newEdge: Edge = {
                  id: `${sourceNode.nodeId}-${newNodeId}`,
                  source: sourceNode.nodeId ? sourceNode.nodeId : '',
                  target: newNodeId,
                  sourceHandle: sourceNode.handleId,
                  targetHandle: newTargetHandleId,
               };

               const flowEdgeBody = {
                  edge_id: newEdge.id,
                  source: newEdge.source,
                  target: newEdge.target,
                  sourcehandle: newEdge.sourceHandle,
                  targethandle: newEdge.targetHandle,
               };

               const edgeResponse = await postFlowStepEdge(flowEdgeBody);
               if (edgeResponse) {
                  setNodes((nds) => nds.concat(newNode));
                  setEdges((eds) => [...eds, newEdge]);
                  setMenuScreenPosition(null);
                  setSourceNode(null);
                  return;
               }
            }
         }
      }
      const newEdge: Edge = {
         id: `${sourceNode.nodeId}-${newNodeId}`,
         source: sourceNode.nodeId ? sourceNode.nodeId : '',
         target: newNodeId,
         sourceHandle: sourceNode.handleId,
         targetHandle: newTargetHandleId,
      };
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => [...eds, newEdge]);
      setMenuScreenPosition(null);
      setSourceNode(null);
   };

   const newMsgNode = async () => {
      const newNodeId = generateId();
      const newTargetHandleId = generateId();
      const newSourceHandleId = generateId();

      const newNode: Node = {
         id: newNodeId,
         position: getRandomPosition(),
         type: 'MessageNode',
         data: {
            label: 'Send a message',
            buttons: [
               { label: 'Message' },
               { label: 'Image' },
               { label: 'Video' },
               { label: 'Audio' },
               { label: 'Document' },
            ],
            deleteNode,
            copyNode,
            updateNodeData,
            newTargetHandleId,
            newSourceHandleId,
            step_order: stepOrder(),
         },
         sourcePosition: Position.Right,
         targetPosition: Position.Left,
      };
      const flowNodeBody = {
         type: newNode.type,
         step_order: newNode.data.step_order,
         metadata: newNode.data,
         node: newNode.id,
         is_starting: newNode.data.step_order === 1 ? true : false,
         next_step_id: null,
         position: newNode.position,
      };

      const newNodeResponse: { data: { id: number } } | undefined = await postFlowStepNode(flowId, flowNodeBody);
      if (newNodeResponse) {
         newNode.data.step_id = newNodeResponse.data.id;
         newNode.data.is_starting = flowNodeBody.is_starting;
         setNodes((nds) => nds.concat(newNode));
      }
   };

   const deleteNode = useCallback(
      async (id: string, step_id: number) => {
         const response: { message: string } | {} | undefined = await deleteFlowStepNode(step_id);
         if (response) {
            setNodes((nodes) => nodes.filter((node) => node.id !== id));
            setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
         }
         return;
      },
      [nodes, setNodes]
   );

   const updateNodeData = useCallback((id: string, newData: Partial<MessageNodeData>) => {
      setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...newData } } : node)));
   }, []);

   const saveNodeData = async (step_id: number, data: MessageNodeData, isDelete?: boolean) => {
      if (isDelete === true) {
         data.inputType = undefined;
         data.inputData = undefined;
      }
      const flowUpdateNode = {
         step_metadata: data,
      };
      const updateResponse = await http.put(`flows_step/${step_id}`, JSON.stringify(flowUpdateNode));
      console.log(updateResponse);
   };

   const copyNode = useCallback(
      async (id: string) => {
         const prevNodes = getNodes();
         const original = prevNodes.find((n) => n.id === id);
         if (!original) return;
         const newId = generateId();

         if (prevNodes.some((n) => n.id === newId)) return;

         const newTargetHandleId = generateId();
         const newSourceHandleId = generateId();

         const newNode: Node = {
            id: newId,
            type: original.type,
            position: {
               x: original.position.x + 200,
               y: original.position.y - 80,
            },
            data: {
               label: original.data.label,
               buttons: [...(original.data.buttons || [])],
               inputType: original.data.inputType,
               inputData: original.data.inputData,
               copyNode,
               deleteNode,
               saveNodeData,
               newTargetHandleId,
               newSourceHandleId,
               step_order: stepOrder(),
               // questionData: original.data.questionData,
               // updateNodeData: original.data.updateNodeData,
            },
            sourcePosition: original.sourcePosition,
            targetPosition: original.targetPosition,
         };
         const flowNodeBody = {
            type: newNode.type,
            step_order: newNode.data.step_order,
            metadata: newNode.data,
            node: newNode.id,
            is_starting: newNode.data.step_order === 1 ? true : false,
            next_step_id: null,
            position: newNode.position,
         };

         const nodeResponse: { data: { id: number } } | undefined = await postFlowStepNode(flowId, flowNodeBody);
         if (nodeResponse) {
            newNode.data.step_id = nodeResponse.data.id;
            newNode.data.is_starting = flowNodeBody.is_starting;
            setNodes((prevNodes) => [...prevNodes, newNode]);
         }
      },
      [deleteNode, updateNodeData]
   );

   const onPaneClick = useCallback(() => {
      if (!isEdgeDropped && menuScreenPosition) {
         setMenuScreenPosition(null);
      } else {
         setIsEdgeDropped(false);
      }
   }, [isEdgeDropped, menuScreenPosition]);

   const mapColor = (node: any) => {
      switch (node.type) {
         case 'MessageNode':
            return '#ff6259';
         case 'QuestionNode':
            return '#fa8e42';
         default:
            return '#1f823b';
      }
   };

   return (
      <>
         <div ref={flowWrapperRef} style={{ position: 'relative', width: '100%', height: 'calc(100vh - 13.5rem)' }}>
            <ReactFlow
               nodes={nodes}
               edges={edges}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
               onConnectStart={onConnectStart}
               onConnectEnd={onConnectEnd}
               connectionLineType={ConnectionLineType.Bezier}
               connectionLineStyle={{ stroke: '#00BFFF', strokeWidth: 3 }}
               onPaneClick={onPaneClick}
               nodeTypes={nodeTypes}
               deleteKeyCode={null}
            >
               <Background variant={BackgroundVariant.Lines} />
               <Controls />
               <MiniMap nodeColor={mapColor} maskColor="rgba(97, 95, 95, 0.23)" nodeBorderRadius={15} />
            </ReactFlow>

            {menuScreenPosition && (
               <div
                  className="absolute z-5"
                  style={{
                     top: menuScreenPosition.y,
                     left: menuScreenPosition.x,
                     width: `${MENU_WIDTH}px`,
                     maxHeight: `${MENU_HEIGHT}px`,
                     overflowY: 'auto',
                     background: '#fff',
                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                     borderRadius: '8px',
                  }}
               >
                  {[
                     { label: 'Send a message', icon: 'pi pi-comment', color: 'bg-pink-500', type: 'MessageNode' },
                     { label: 'Question', icon: 'pi pi-question-circle', color: 'bg-orange-400', type: 'QuestionNode' },
                     { label: 'Set a condition', icon: 'pi pi-send', color: 'bg-blue-500', type: 'ConditionNode' },
                     { label: 'Buttons', icon: 'pi pi-th-large', color: 'bg-orange-400', type: 'ButtonNode' },
                     { label: 'List', icon: 'pi pi-list', color: 'bg-orange-400', type: 'ListNode' },
                  ].map((item, index) => (
                     <div
                        key={index}
                        className="flex align-items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-duration-200"
                        onClick={() => {
                           addNewNode(item.type);
                        }}
                     >
                        <div className={`p-2 border-circle ${item.color} text-white`}>
                           <i className={item.icon}></i>
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </>
   );
};

export default FlowEditor;
