import { useContext } from 'react';
import { MenuContext } from '../../layout/context/menuProvider';

const FlowMenu = () => {
   const { setIsNewNode } = useContext(MenuContext);
   const createNode = () => {
      setIsNewNode(true);
   };
   return (
      <>
         <div
            onClick={createNode}
            style={{ backgroundColor: '#ff6259' }}
            className="my-2 py-2 border-round-xl cursor-pointer flex justify-content-between align-items-center"
         >
            <div className="my-3 mx-3">
               <h5 style={{ fontSize: '16px' }} className="mb-2 font-semibold text-white">
                  Send a Message
               </h5>
               <p style={{ fontSize: '13px' }} className="text-white">
                  With No Response Required from Visitor
               </p>
            </div>
            <i
               className="pi pi-comments p-3 mr-2 text-white border-circle"
               style={{ fontSize: '25px', backgroundColor: '#ffffff4d' }}
            ></i>
         </div>
      </>
   );
};

export default FlowMenu;
