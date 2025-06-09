import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider } from './layout/context/layoutContext';
import Routing from './routes';
import './styles/layout/layout.scss';
import { ReactFlowProvider } from 'reactflow';
import { MenuProvider } from './layout/context/menuProvider';

function App() {
   return (
      <BrowserRouter>
         <LayoutProvider>
            <ReactFlowProvider>
               <MenuProvider>
                  <Routing />
               </MenuProvider>
            </ReactFlowProvider>
         </LayoutProvider>
      </BrowserRouter>
   );
}

export default App;
