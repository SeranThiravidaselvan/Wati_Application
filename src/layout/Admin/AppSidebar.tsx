import FlowMenu from '../../components/FlowMenu';
import AppMenu from './AppMenu';

const AppSidebar = () => {
   const isPathFlow = location.pathname.includes('flow');
   return <>{isPathFlow ? <FlowMenu /> : <AppMenu />}</>;
};

export default AppSidebar;
