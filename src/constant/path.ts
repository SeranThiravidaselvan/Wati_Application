interface RoutePath {
   name: string;
   value: string;
}

const ROUTES = {
   UINVERSAL: { name: 'global', value: '*' },
   HOME: { name: 'HOME', value: '/' },
   LOGIN: { name: 'LOGIN', value: '/login' },
   FORGOT_PASSWORD: { name: 'FORGOTPASSWORD', value: '/forgot-password' },
   RESET_PASSWORD: { name: 'RESETPASSWORD', value: '/reset-password' },
   DASHBOARD: { name: 'DASHBOARD', value: '/dashboard' },
   TENDER: { name: 'TENDER', value: '/tender' },
   VENDOR: { name: 'VENDOR', value: '/vendor' },
   RAMINFO: { name: 'RAMINFO', value: '/raminfo' },
   REPORT: { name: 'REPORT', value: '/report' },
   USER: { name: 'USER', value: '/user' },
   PAGE_NOT_FOUND: { name: '404', value: '/pagenotfound' },
   EXPIRED_PAGE: { name: 'ExpiredPage', value: '/ExpiredPage' },
} satisfies Record<string, RoutePath>;

export default ROUTES;
