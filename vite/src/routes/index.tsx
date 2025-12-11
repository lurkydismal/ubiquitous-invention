import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default createBrowserRouter([MainRoutes, AuthenticationRoutes], {
    basename: import.meta.env.VITE_APP_BASE_NAME || '/'
});
