import React, { useEffect, useRef, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuType } from 'primereact/tieredmenu';
import { InputAudio, InputBox, InputDoc, InputImage, InputVideo } from '../MessageNodeInputs';
import './customNode.css';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MessageNodeData, QuestionNodeData } from '../../types/NodeTypes';
import { generateId } from '../../pages/FlowEditor';
// import { InputSwitch } from 'primereact/inputswitch';

const MessageNode: React.FC<NodeProps<MessageNodeData>> = ({ id, data }) => {
   const items: MenuItem[] = [
      {
         label: 'Copy',
         icon: 'pi pi-copy',
         command: () => {
            data.copyNode(id);
         },
      },
      {
         label: 'Delete',
         icon: 'pi pi-trash',
         command: () => {
            data.deleteNode(id, data.step_id);
         },
      },
      // {
      //    label: 'Set start Node',
      //    icon: 'pi pi-flag',
      //    command: () => {},
      // },
   ];

   const menu = useRef<TieredMenuType>(null);

   const addInput = (inputType: string) => {
      data.updateNodeData?.(id, {
         inputType,
         inputData: null,
      });
   };

   const deleteInput = () => {
      data.updateNodeData?.(id, {
         inputType: undefined,
         inputData: undefined,
      });
      handleSave(true);
   };

   const handleInputChange = (value: any) => {
      data.updateNodeData?.(id, {
         inputData: value,
      });
   };

   const handleSave = (isDelete?: boolean) => {
      data.saveNodeData(data.step_id, data, isDelete);
   };

   const renderInput = () => {
      switch (data.inputType) {
         case 'Message':
            return (
               <InputBox
                  deleteInput={deleteInput}
                  inputData={data.inputData}
                  onChange={handleInputChange}
                  handleSave={handleSave}
               />
            );
         case 'Image':
            return (
               <InputImage
                  deleteInput={deleteInput}
                  inputData={data.inputData}
                  onChange={handleInputChange}
                  handleSave={handleSave}
               />
            );
         case 'Video':
            return (
               <InputVideo
                  deleteInput={deleteInput}
                  inputData={data.inputData}
                  onChange={handleInputChange}
                  handleSave={handleSave}
               />
            );
         case 'Audio':
            return (
               <InputAudio
                  deleteInput={deleteInput}
                  inputData={data.inputData}
                  onChange={handleInputChange}
                  handleSave={handleSave}
               />
            );
         case 'Document':
            return (
               <InputDoc
                  deleteInput={deleteInput}
                  inputData={data.inputData}
                  onChange={handleInputChange}
                  handleSave={handleSave}
               />
            );
         default:
            return null;
      }
   };
   console.log(data);

   return (
      <div
         style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: '#fff',
            width: '290px',
            position: 'relative',
         }}
      >
         {data.is_starting && (
            <div
               style={{
                  position: 'absolute',
                  top: '-33px',
                  zIndex: '-1',
                  left: '87px',
                  padding: '4px 10px',
                  backgroundColor: 'darkslategray',
                  color: 'white',
                  borderRadius: '7px 7px 0 0',
               }}
            >
               <p>Starting Step</p>
            </div>
         )}
         <div
            className="bg-red-400 px-4 text-white"
            style={{ borderTopRightRadius: '6px', borderTopLeftRadius: '6px' }}
         >
            <div className="grid align-items-center">
               <div className="col-8 p-0">
                  <span className="message_icon ">
                     <i className="pi pi-comments"></i>
                  </span>
                  {data.label}
               </div>
               <div className="col-4 align-items-center justify-content-end text-right">
                  <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
                  <Button className="option-btn" onClick={(e) => menu?.current?.toggle(e)}>
                     <i className="pi pi-ellipsis-v" />
                  </Button>
               </div>
            </div>
         </div>
         <div>{renderInput()}</div>
         <div className="my-2" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {data.buttons.map((btn, idx) => (
               <button
                  key={idx}
                  onClick={() => {
                     addInput(btn.label);
                  }}
                  style={{
                     marginRight: 5,
                     width: '80px',
                     margin: '7px',
                     padding: '10px',
                     backgroundColor: 'white',
                     border: '1px solid #1f823b',
                     borderRadius: '6px',
                     color: '#1f823b',
                     cursor: 'pointer',
                  }}
               >
                  {btn.label}
               </button>
            ))}
         </div>
         {!data.initialNode && (
            <Handle
               type="target"
               position={Position.Left}
               id={data.newTargetHandleId}
               style={{
                  background: 'transparent',
                  border: 'none',
                  width: 10,
                  height: 10,
                  opacity: 0,
               }}
            />
         )}
         <Handle
            type="source"
            id={data.initialNode ? 'initial' : data.newSourceHandleId}
            position={Position.Right}
            style={{
               backgroundColor: '#e95b69',
               height: '12px',
               width: '12px',
            }}
         />
      </div>
   );
};

const QuestionNode: React.FC<NodeProps<QuestionNodeData>> = ({ id, data }) => {
   const items: MenuItem[] = [
      {
         label: 'Copy',
         icon: 'pi pi-copy',
         command: () => {
            data.copyNode(id);
         },
      },
      {
         label: 'Delete',
         icon: 'pi pi-trash',
         command: () => {
            data.deleteNode(id);
         },
      },
   ];

   const menu = useRef<any>(null);
   const buttonRef = useRef<any>(null);

   const [dialogvisible, setDialogvisible] = useState<boolean>(false);
   const [formData, setFormData] = useState({
      question: '',
      answers: [{ sourceId: 'default', answer: 'Default' }],
   });
   const [errors, setErrors] = useState<{ question?: string; answers?: string } | null>({});
   const [newAnswer, setNewAnswer] = useState('');

   useEffect(() => {
      if (data.questionData) {
         setFormData(data.questionData);
      }
   }, []);

   useEffect(() => {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
         window.removeEventListener('keydown', handleKeyPress);
      };
   }, []);

   const validateForm = () => {
      const newErrors: { question?: string; answers?: string } = {};

      if (!formData.question.trim()) {
         newErrors.question = 'Question is required.';
      }

      if (formData.answers.length < 2) {
         newErrors.answers = 'At least two answers are required.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSave = () => {
      if (!validateForm()) return;
      handleQuestionChanges();
      setDialogvisible(false);
   };

   const addAnswer = () => {
      if (!newAnswer.trim()) return;
      const ansData = {
         sourceId: generateId(),
         answer: newAnswer,
      };
      setFormData((prev) => ({
         ...prev,
         answers: [...prev.answers, ansData],
      }));
      setNewAnswer('');
      if (errors?.answers) {
         setErrors((prev) => ({ ...prev, answers: undefined }));
      }
   };

   const removeAnswer = (indexToRemove: number) => {
      const updatedAnswers = formData.answers.filter((_, index) => index !== indexToRemove);
      setFormData((prev) => ({
         ...prev,
         answers: updatedAnswers,
      }));
      if (updatedAnswers.length >= 2 && errors?.answers) {
         setErrors((prev) => ({ ...prev, answers: undefined }));
      }
   };

   const handleQuestionChanges = () => {
      data.updateNodeData?.(id, {
         questionData: formData,
      });
   };

   const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
         buttonRef.current?.click();
      }
   };

   const dialogFooterTemplate = () => (
      <div className="flex justify-content-end">
         <Button
            label="Cancel"
            className="btn-cancel"
            onClick={() => {
               setErrors(null);
               setDialogvisible(false);
            }}
         />
         <Button label="Save" className="btn-save" onClick={handleSave} />
      </div>
   );

   return (
      <div
         style={{ border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', width: '290px' }}
         onDoubleClick={() => setDialogvisible(true)}
      >
         <div
            className="bg-orange-400 px-4 text-white"
            style={{ borderTopRightRadius: '6px', borderTopLeftRadius: '6px' }}
         >
            <div className="grid align-items-center">
               <div className="col-8 p-0">
                  <span className="message_icon">
                     <i className="pi pi-question"></i>
                  </span>{' '}
                  Question
               </div>
               <div className="col-4 text-right">
                  <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
                  <Button className="option-btn" onClick={(e) => menu?.current?.toggle(e)}>
                     <i className="pi pi-ellipsis-v" />
                  </Button>
               </div>
            </div>
         </div>

         <div className="m-2">
            <p>{formData.question}</p>
         </div>

         {formData.answers.map((ansData, index) => (
            <div key={index} className="m-2" style={{ display: 'flex', flexWrap: 'wrap' }}>
               <div
                  className="col-12 text-center bg-black-alpha-10"
                  style={{ position: 'relative', padding: 10, borderRadius: 8 }}
               >
                  {ansData.answer}
                  <Handle
                     type="source"
                     id={ansData.sourceId}
                     position={Position.Right}
                     style={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: -6,
                        background: 'green',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        position: 'absolute',
                     }}
                  />
               </div>
            </div>
         ))}

         <Handle
            type="target"
            position={Position.Left}
            id={data.newTargetHandleId}
            style={{
               background: 'transparent',
               border: 'none',
               width: 10,
               height: 10,
               opacity: 0,
            }}
         />

         <Dialog
            header="Set a Question"
            visible={dialogvisible}
            draggable={false}
            style={{ width: '30vw' }}
            onHide={() => {
               setErrors(null);
               setDialogvisible(false);
            }}
            onClick={(e) => e.stopPropagation()}
            footer={dialogFooterTemplate}
            dismissableMask={true}
         >
            <form>
               <div className="flex flex-column gap-2">
                  <label htmlFor="Question_text">Question text</label>
                  <InputText
                     id="Question_text"
                     value={formData.question}
                     onChange={(e) => {
                        setFormData({ ...formData, question: e.target.value });
                        if (errors?.question) {
                           setErrors((prev) => ({ ...prev, question: undefined }));
                        }
                     }}
                     className={errors?.question ? 'p-invalid' : ''}
                  />
                  {errors?.question && (
                     <small className="p-error" style={{ fontSize: '12px' }}>
                        {errors.question}
                     </small>
                  )}
               </div>

               <hr />

               <div>
                  <p className="fw-bold">Answer Options</p>
                  {formData.answers.map((ansData, index) => (
                     <div key={index} className="p-inputgroup mb-2">
                        <InputText value={ansData.answer} readOnly className="w-full" />
                        <Button
                           type="button"
                           icon="pi pi-trash"
                           className="btn-del"
                           onClick={() => removeAnswer(index)}
                        />
                     </div>
                  ))}
                  {errors?.answers && (
                     <small className="p-error" style={{ fontSize: '12px' }}>
                        {errors.answers}
                     </small>
                  )}

                  <p className="fw-bold">Add answer variant</p>
                  <div className="p-inputgroup">
                     <InputText value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Answer" />
                     <Button ref={buttonRef} type="button" label="Create" className="btn-com" onClick={addAnswer} />
                  </div>
               </div>
            </form>
         </Dialog>
      </div>
   );
};

export { MessageNode, QuestionNode };
