import React from 'react';
import { InputText } from 'primereact/inputtext';
import { GenericFileUpload } from './fileUpload';
import { InputProps } from '../../types/NodeTypes';

const InputBox: React.FC<InputProps> = ({ deleteInput, inputData, onChange, handleSave }) => {
   return (
      <div className="my-3 mx-3">
         <InputText className="w-full" value={inputData || ''} onChange={(e) => onChange(e.target.value)} />
         <div className="flex flex-row justify-content-between my-2">
            <div>
               <button
                  className="pi pi-trash my-1 text-red-500 border-none bg-transparent"
                  onClick={deleteInput}
               ></button>
            </div>
            <div>
               <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 border-black-alpha-50 border-round border-1 text-white text-base"
               >
                  Save
               </button>
            </div>
         </div>
      </div>
   );
};
const InputImage: React.FC<InputProps> = ({ deleteInput, inputData, onChange, handleSave }) => (
   <GenericFileUpload
      label="Upload Image"
      accept="image/*"
      inputData={inputData}
      onChange={onChange}
      deleteInput={deleteInput}
      handleSave={handleSave}
      type="image"
   />
);

const InputVideo: React.FC<InputProps> = ({ deleteInput, inputData, onChange, handleSave }) => (
   <GenericFileUpload
      label="Upload Video"
      accept="video/*"
      inputData={inputData}
      onChange={onChange}
      deleteInput={deleteInput}
      handleSave={handleSave}
      type="video"
   />
);

const InputAudio: React.FC<InputProps> = ({ deleteInput, inputData, onChange, handleSave }) => (
   <GenericFileUpload
      label="Upload Audio"
      accept="audio/*"
      inputData={inputData}
      onChange={onChange}
      deleteInput={deleteInput}
      handleSave={handleSave}
      type="audio"
   />
);

const InputDoc: React.FC<InputProps> = ({ deleteInput, inputData, onChange, handleSave }) => (
   <GenericFileUpload
      label="Upload Document"
      accept=".pdf,.doc,.docx,.xls,.xlsx"
      inputData={inputData}
      onChange={onChange}
      deleteInput={deleteInput}
      handleSave={handleSave}
      type="document"
   />
);

export { InputBox, InputAudio, InputDoc, InputImage, InputVideo };
