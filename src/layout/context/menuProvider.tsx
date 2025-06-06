import { useState, createContext } from 'react';
import { ChildContainerProps, MenuContextProps } from '../../types';

export const MenuContext = createContext({} as MenuContextProps);

export const MenuProvider = ({ children }: ChildContainerProps) => {
   const [activeMenu, setActiveMenu] = useState('');
   const [isNewNode, setIsNewNode] = useState(false);

   const value = {
      activeMenu,
      setActiveMenu,
      isNewNode,
      setIsNewNode,
   };

   return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
