import { useContext, useEffect, useRef } from 'react';
import { LayoutContext } from '../context/layoutContext';
import { AppTopbarRef, ChildContainerProps, LayoutState } from '../../types';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames } from 'primereact/utils';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import AppTopbar from './AppTopbar';
import AppSidebar from './AppSidebar';
// import AppFooter from './AppFooter';
import AppConfig from './AppConfig';

const AdminLayout: React.FC<ChildContainerProps> = () => {
  const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
  const topbarRef = useRef<AppTopbarRef>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: (event) => {
      const isOutsideClicked = !(
        sidebarRef.current?.contains(event.target as Node) ||
        topbarRef.current?.menubutton?.contains(event.target as Node)
      );
      if (isOutsideClicked) {
        hideMenu();
      }
    },
  });

  const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
      );
      if (isOutsideClicked) {
        hideProfileMenu();
      }
    },
  });

  const hideMenu = () => {
    setLayoutState((prev: LayoutState) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const hideProfileMenu = () => {
    setLayoutState((prev: LayoutState) => ({
      ...prev,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const blockBodyScroll = () => {
    document.body.classList.add('blocked-scroll');
  };

  const unblockBodyScroll = () => {
    document.body.classList.remove('blocked-scroll');
  };

  // Close menus when navigating or changing search params
  useEffect(() => {
    hideMenu();
    hideProfileMenu();
  }, [location.pathname, searchParams]);

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    if (layoutState.staticMenuMobileActive) {
      blockBodyScroll();
    } else {
      unblockBodyScroll();
    }
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }
  }, [layoutState.profileSidebarVisible]);

  // Cleanup event listeners on component unmount
  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  const containerClass = classNames('layout-wrapper', {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive,
    'p-input-filled': layoutConfig.inputStyle === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple,
  });

  return (
    <div className={containerClass}>
      <AppTopbar ref={topbarRef} />
      <div ref={sidebarRef} className="layout-sidebar">
        <AppSidebar />
      </div>
      <div className="layout-main-container">
        <div className="card ">{<Outlet />}</div>
        {/* <AppFooter /> */}
      </div>
      <AppConfig />
      <div className="layout-mask"></div>
    </div>
  );
};

export default AdminLayout;
