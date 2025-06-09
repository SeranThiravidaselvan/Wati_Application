import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
const ChatInbox = () => {
   return (
      <div className="flex p-0 surface-100 shadow-1 border-1 border-300" style={{ height: 'calc(100vh - 13.2rem)' }}>
         <div className="w-8 flex flex-column">
            <div className="bg-white py-3 flex border-bottom-2 border-200">
               <i className="pi pi-user text-3xl px-3 my-1"></i>
            </div>
            <div className="flex-grow-1"></div>
            <div className="bg-white border-2 border-200 py-3 px-2 m-2 flex h-5rem">
               <InputTextarea rows={3} placeholder="Type Message Here" className="w-23rem"></InputTextarea>
               <div className="flex align-items-center justify-content-between flex-grow-1 mx-2">
                  <i className="cursor-pointer pi pi-paperclip px-1 text-2xl"></i>
                  <i className="cursor-pointer pi pi-face-smile px-1 text-2xl"></i>
                  <i className="cursor-pointer pi pi-bolt px-1 text-2xl"></i>
                  <i className="cursor-pointer pi pi-folder-open px-1 text-2xl"></i>
                  <i className="cursor-pointer pi pi-android px-1 text-2xl"></i>
               </div>
               <Button className="bg-green-600 border-0 py-1">Send</Button>
            </div>
         </div>
         <div className="w-4 bg-white border-left-2 border-200">hi</div>
      </div>
   );
};

export default ChatInbox;
