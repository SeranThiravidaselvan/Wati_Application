// routing.tsx
import { Route, Routes } from 'react-router-dom';
import Protected from '../gaurd';
import UserLayout from '../layout/User/UserLayout';
import AdminLayout from '../layout/Admin/AdminLayout';
import Dashboard from '../pages/Dashboard';
import ChatBotTable from '../pages/ChatBotTable';
import FlowEditor from '../pages/FlowEditor';
import ChatInbox from '../pages/ChatInbox';

const Routing = () => {
   return (
      <Routes>
         {/* Layout for the main path */}
         <Route path="/" element={<Protected Cmp={AdminLayout} />}>
            <Route path="dashboard" element={<Protected Cmp={Dashboard} />} />
            <Route path="chatbot" element={<Protected Cmp={ChatBotTable} />} />
            <Route path="chatbot/flow/:id" element={<Protected Cmp={FlowEditor} />} />
            <Route path="chatinbox" element={<Protected Cmp={ChatInbox} />} />
         </Route>

         {/* SimpleLayout for the /sample path */}
         <Route path="/user-layout" element={<Protected Cmp={UserLayout} />}></Route>
      </Routes>
   );
};

export default Routing;
