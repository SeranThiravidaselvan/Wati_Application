import React from 'react';
import AppConfig from '../Admin/AppConfig';
import { ChildContainerProps } from '../../types';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const UserLayout: React.FC<ChildContainerProps> = () => {
   return (
      <React.Fragment>
         <div className="surface-0 flex justify-content-center">
            <div id="home" className="overflow-hidden p-3 md:px-8 sm:px-5 w-full" style={{ maxWidth: '1440px' }}>
               <Header />
               <Outlet />
               <div className="mt-8 border-top-1 surface-border">
                  <Footer />
               </div>
            </div>
         </div>
         <AppConfig simple />
      </React.Fragment>
   );
};

export default UserLayout;
