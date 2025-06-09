import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { MenuContext } from '../context/menuProvider';
import { AppMenuItemProps, NavItem } from '../../types/layout';
import { CSSTransition } from 'react-transition-group';
import { classNames } from 'primereact/utils';
import { Ripple } from 'primereact/ripple';

const AppMenuitem = (props: AppMenuItemProps) => {
   const { pathname } = useLocation();
   const [searchParams] = useSearchParams();
   const { activeMenu, setActiveMenu } = useContext(MenuContext);

   const item: NavItem | undefined = props.item;
   const key = props.parentKey ? `${props.parentKey}-${props.index}` : String(props.index);
   const isActiveRoute = item?.path && pathname === item.path;
   const active = activeMenu === key || activeMenu.startsWith(`${key}-`);

   // Sync active menu with the current route
   useEffect(() => {
      if (item?.path && pathname === item.path && activeMenu !== key) {
         setActiveMenu(key);
      }
   }, [pathname, searchParams]);

   if (!item || item.visible === false) return null;

   const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (item.disabled) {
         event.preventDefault();
         return;
      }
      setActiveMenu(key);
   };

   const subMenu = item.items?.length && (
      <CSSTransition
         timeout={{ enter: 1000, exit: 450 }}
         classNames="layout-submenu"
         in={props.root ? true : active}
         key={item.label}
      >
         <ul>
            {item.items.map((child, i) => (
               <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />
            ))}
         </ul>
      </CSSTransition>
   );

   return (
      <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
         <Link
            to={item.path || ''}
            replace={item.replaceUrl}
            target={item.target}
            onClick={itemClick}
            className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute })}
            tabIndex={0}
         >
            <i className={classNames('layout-menuitem-icon', item.icon)}></i>
            <span className="layout-menuitem-text">{item.label}</span>
            <Ripple />
         </Link>
         {subMenu}
      </li>
   );
};

export default AppMenuitem;
