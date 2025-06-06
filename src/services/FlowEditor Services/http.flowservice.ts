import {
   flowEdge,
   getFlowNodeModel,
   postFlowEdgeModel,
   postFlowNodeModel,
   putFlowNodeModel,
} from '../../types/NodeTypes';
import { http } from '../http.service';

const getFlowNodeData = async (id: string) => {
   try {
      const response: { data: getFlowNodeModel[] } = await http.get(`flow_json/${id}`);
      if (response) {
         return response.data;
      } else {
         throw new Error(response);
      }
   } catch (error) {
      console.error('Error Occured', error);
   }
};
const getFlowEdgeData = async () => {
   try {
      const response: flowEdge[] = await http.get('get_edge');
      if (response) {
         return response;
      } else {
         throw new Error(response);
      }
   } catch (error) {
      console.error('Error Occured', error);
   }
};

const postFlowStepNode = async (id: string, body: postFlowNodeModel) => {
   try {
      const response: { data: { id: number } } | null = await http.post(`flows_steps/${id}`, JSON.stringify(body));
      if (response) {
         return response;
      } else {
         throw new Error();
      }
   } catch (error) {
      console.error('Error Occured', error);
   }
};

const postFlowStepEdge = async (body: postFlowEdgeModel) => {
   try {
      const response: { data: { id: number } } | null = await http.post(`create_edge`, JSON.stringify(body));
      if (response) {
         return response;
      } else {
         throw new Error();
      }
   } catch (error) {
      console.error('Error Occured', error);
   }
};

const putFlowStepNode = async (id: string, body: putFlowNodeModel) => {
   try {
      const response = await http.put(`flows_step/${id}`, JSON.stringify(body));
      if (response) {
         return response;
      } else {
         throw new Error();
      }
   } catch (error) {
      console.error('Error Occured', error);
   }
};

const deleteFlowStepNode = async (id: number) => {
   try {
      const response = await http.delete(`delete/flowstep/${id}`);
      if (response) {
         return response;
      } else {
         throw new Error();
      }
   } catch (error) {
      console.error('Error Occured', error);
   }
};
export { getFlowNodeData, getFlowEdgeData, postFlowStepNode, putFlowStepNode, postFlowStepEdge, deleteFlowStepNode };
