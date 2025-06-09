import React, { useEffect, useState } from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { GenericFileUploadProps } from '../../types/NodeTypes';

const GenericFileUpload: React.FC<GenericFileUploadProps> = ({
   accept,
   label,
   inputData,
   onChange,
   deleteInput,
   type,
   handleSave,
}) => {
   const [selectedFile, setSelectedFile] = useState<File | null>(inputData?.[0] || null);

   useEffect(() => {
      setSelectedFile(inputData?.[0] || null);
   }, [inputData]);

   const handleSelect = (e: FileUploadSelectEvent) => {
      const file = e.files[0];
      setSelectedFile(file);
      onChange([file]); // Send as array to match node.data structure
   };

   const handleClear = () => {
      setSelectedFile(null);
      onChange([]);
   };

   const renderPreview = () => {
      if (!selectedFile) return null;

      const url = URL.createObjectURL(selectedFile);

      switch (type) {
         case 'image':
            return <img src={url} alt="preview" className="w-full mt-2 rounded shadow-md object-cover" />;
         case 'video':
            return (
               <video controls className="w-full mt-2 rounded shadow">
                  <source src={url} type={selectedFile.type} />
               </video>
            );
         case 'audio':
            return (
               <audio controls className="w-full mt-2">
                  <source src={url} type={selectedFile.type} />
               </audio>
            );
         case 'document':
            return <p className="mt-2 text-sm text-gray-700">{selectedFile.name}</p>;
         default:
            return null;
      }
   };

   return (
      <div className="my-3 mx-3">
         {renderPreview()}
         <div className="flex">
            {!selectedFile && (
               <FileUpload
                  className="w-full"
                  name="file"
                  chooseLabel={label}
                  mode="basic"
                  accept={accept}
                  //   maxFileSize={1000000}
                  customUpload
                  auto
                  multiple={false}
                  onSelect={handleSelect}
               />
            )}
            {selectedFile && (
               <button
                  className="w-full text-red-500 bg-white border-round py-2 text-base font-semibold"
                  style={{ border: '1px solid red' }}
                  onClick={handleClear}
               >
                  Remove
               </button>
            )}
         </div>

         <div className="flex justify-content-between my-2">
            <div>
               <button className="pi pi-trash text-red-500 border-none bg-transparent" onClick={deleteInput} />
            </div>
            <div>
               <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 border-1 border-black-alpha-50 border-round text-white text-base"
               >
                  Save
               </button>
            </div>
         </div>
      </div>
   );
};

export { GenericFileUpload };
