import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../../types';
import { LayoutContext } from '../context/layoutContext';
import { Link } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

const AppTopbar = forwardRef<AppTopbarRef>((_props, ref) => {
  const { layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current
  }));

  return (
    <div className="layout-topbar">
      <Link to="/" className="layout-topbar-logo">
        <img src={`https://cdn-icons-png.freepik.com/256/1055/1055666.png?uid=P112914804&ga=GA1.1.1751373662.1744639917&semt=ais_hybrid`} alt="Logo" height="20" className="mr-2" style={{ borderRadius: '100%' }} />
        <span>Sample Layout</span>
      </Link>

      <Button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
        <i className="pi pi-bars" />
      </Button>

      <Button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
        <i className="pi pi-ellipsis-v" />
      </Button>

      <div
        ref={topbarmenuRef}
        className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}
      >
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button>
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <Link to="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
