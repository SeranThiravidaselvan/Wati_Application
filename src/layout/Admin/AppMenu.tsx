import AppMenuitem from './AppMenuitem';
import { useEffect, useState } from 'react';
import { NavItem } from '../../types/layout';
import { data } from '../../constant/NavData';
const AppMenu = () => {
   const [menuItem, setMenuItem] = useState<NavItem[]>([]);

   useEffect(() => {
      const arr = data.filter((item) => item.role);
      setMenuItem(arr);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <div className="layout-menu">
            <ul>
               {menuItem.map((item, i) => {
                  return <AppMenuitem item={item} root={false} index={i} key={item.label} />;
               })}
            </ul>
         </div>
         <div>{/* <AppFooter /> */}</div>
      </>
   );
};

export default AppMenu;
