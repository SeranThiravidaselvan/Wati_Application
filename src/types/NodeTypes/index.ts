export interface getFlowNodeModel {
   id: number;
   type_name: string;
   step_order: number;
   metadata: { label?: string; buttons: ButtonData[] };
   next_step_id: number | null;
   is_starting: boolean;
   node: string;
   position: { x: number; y: number };
}

export interface postFlowNodeModel {
   type: string | undefined;
   step_order: number;
   metadata: { label?: string; buttons: ButtonData[] };
   next_step_id: number | null;
   is_starting: boolean;
   node: string;
   position: { x: number; y: number };
}

export interface postFlowEdgeModel {
   edge_id: string;
   source: string;
   target: string;
   sourcehandle: string | null | undefined;
   targethandle: string | null | undefined;
}

export interface putFlowNodeModel {
   step_metadata?: Partial<MessageNodeData>;
   next_step_id?: number;
}

export interface ButtonData {
   label: string;
   onClick?: () => void;
}

export interface sourceNode {
   nodeId: string | null;
   handleId: string | null;
   handleType: string | null;
}

export interface flowEdge {
   sourcehandle: string;
   source: string;
   id: number;
   updated_at: string;
   edge_id: string;
   targethandle: string;
   target: string;
   created_at: string;
}

export interface MessageNodeData {
   label?: string;
   buttons: ButtonData[];
   initialNode?: boolean;
   deleteNode: (id: string, step_id: number) => void;
   copyNode: (id: string) => void;
   saveNodeData: (step_id: number, data: MessageNodeData, isDelete?: boolean) => void;

   // New fields to hold input info
   inputType?: string;
   inputData?: any;
   step_id: number;
   is_starting: boolean;

   updateNodeData?: (id: string, newData: Partial<MessageNodeData>) => void;
   newTargetHandleId?: string;
   newSourceHandleId?: string;
}

export interface MessageNodeModel {
   id: string;
   type: string;
   position: { x: number; y: number };
   data: MessageNodeData;
}

export interface answers {
   sourceId: string;
   answer: string;
}

export interface QuestionNodeData {
   label: string;
   text: string;
   qus: string;
   options: any;
   initialNode?: Boolean;
   newTargetHandleId: string;
   deleteNode: (id: string) => void;
   copyNode: (id: string) => void;

   questionData?: {
      question: string;
      answers: answers[];
   };

   updateNodeData?: (id: string, newData: Partial<QuestionNodeData>) => void;
}

export interface InputProps {
   inputData: any;
   onChange: (value: any) => void;
   deleteInput: () => void;
   handleSave: () => void;
}

export interface GenericFileUploadProps {
   accept: string;
   label: string;
   inputData: File[]; // node.data.inputs[n].data should be an array with 1 item
   onChange: (files: File[]) => void;
   deleteInput: () => void;
   type: 'image' | 'video' | 'audio' | 'document';
   handleSave: () => void;
}

export interface chatBotDataModel {
   name: string;
   id: number;
   updated_at: string;
   description: string;
   created_at: string;
}
