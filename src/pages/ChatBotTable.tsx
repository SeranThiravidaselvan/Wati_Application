import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { http } from '../services/http.service';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatBotDataModel } from '../types/NodeTypes';

const ChatBotTable = () => {
   useEffect(() => {
      nodeData();
   }, []);

   const [data, setData] = useState<chatBotDataModel[]>([]);

   const nodeData = async () => {
      const response: chatBotDataModel[] = await http.get(`get_chatbot`);
      setData(response);
   };

   const dateFormatter = (date: string) => {
      const formatDate = new Date(date).toLocaleString();
      return <>{formatDate}</>;
   };

   const triggerName = (row: chatBotDataModel) => {
      const navigate = useNavigate();

      return (
         <>
            <h6
               onClick={() => {
                  navigate(`flow/${row.id}`);
               }}
            >
               <span className="text-blue-700 cursor-pointer">{row.name}</span>
            </h6>
         </>
      );
   };

   return (
      <div>
         <div className="">
            <h4>Chatbots</h4>
         </div>
         <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
            <Column
               field="name"
               header="Name"
               body={(rowdata) => {
                  return triggerName(rowdata);
               }}
            ></Column>
            <Column
               field="updated_at"
               header="Updated Date"
               body={(rowdata) => {
                  return dateFormatter(rowdata.updated_at);
               }}
            ></Column>
            <Column
               field="created_at"
               header="Created Date"
               body={(rowdata) => {
                  return dateFormatter(rowdata.created_at);
               }}
            ></Column>
         </DataTable>
      </div>
   );
};

export default ChatBotTable;
