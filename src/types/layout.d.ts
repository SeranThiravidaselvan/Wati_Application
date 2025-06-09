import React, {
   ReactElement,
   Dispatch,
   SetStateAction,
   MutableRefObject,
   HTMLAttributeAnchorTarget,
   ReactNode,
} from 'react';

/* Breadcrumb Types */
export interface Breadcrumb {
   labels?: string[];
   to?: string;
}

export interface BreadcrumbItem {
   label: string;
   to?: string;
   items?: BreadcrumbItem[];
}

/* Layout Context Types */
export type LayoutState = {
   staticMenuDesktopInactive: boolean;
   overlayMenuActive: boolean;
   profileSidebarVisible: boolean;
   configSidebarVisible: boolean;
   staticMenuMobileActive: boolean;
   menuHoverActive: boolean;
};

export type LayoutConfig = {
   ripple: boolean;
   inputStyle: string;
   menuMode: string;
   colorScheme: string;
   theme: string;
   scale: number;
};

export interface LayoutContextProps {
   layoutConfig: LayoutConfig;
   setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
   layoutState: LayoutState;
   setLayoutState: Dispatch<SetStateAction<LayoutState>>;
   onMenuToggle: () => void;
   showProfileSidebar: () => void;
}

/* Menu Context Types */
export interface MenuContextProps {
   activeMenu: string;
   setActiveMenu: Dispatch<SetStateAction<string>>;
   isNewNode: boolean;
   setIsNewNode: Dispatch<SetStateAction<boolean>>;
}

/* AppConfig Types */
export interface AppConfigProps {
   simple?: boolean;
}

/* AppTopbar Types */
export type NodeRef = MutableRefObject<ReactNode>;
export interface AppTopbarRef {
   menubutton?: HTMLButtonElement | null;
   topbarmenu?: HTMLDivElement | null;
   topbarmenubutton?: HTMLButtonElement | null;
}

/* AppMenu Types */
type CommandProps = {
   originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
   item: MenuModelItem;
};

export interface MenuProps {
   model: MenuModel[];
}

export interface MenuModel {
   label: string;
   icon?: string;
   items?: MenuModel[];
   to?: string;
   url?: string;
   target?: HTMLAttributeAnchorTarget;
   separator?: boolean;
}

export interface AppMenuItem extends MenuModel {
   items?: AppMenuItem[];
   badge?: 'UPDATED' | 'NEW';
   badgeClass?: string;
   class?: string;
   preventExact?: boolean;
   visible?: boolean;
   disabled?: boolean;
   replaceUrl?: boolean;
   command?: ({ originalEvent, item }: CommandProps) => void;
}

export interface AppMenuItemProps {
   item?: NavItem;
   parentKey?: string;
   index?: number;
   root?: boolean;
   className?: string;
}

export interface NavItem extends MenuModel {
   items?: NavItem[];
   badge?: 'UPDATED' | 'NEW';
   badgeClass?: string;
   class?: string;
   preventExact?: boolean;
   label: string;
   icon?: string;
   path?: string;
   disabled: boolean;
   visible: boolean;
   role?: string[];
   replaceUrl?: boolean;
}
