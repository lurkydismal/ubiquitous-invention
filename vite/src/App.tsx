// import { RouterProvider } from 'react-router-dom';
//
// // routing
// import router from './routes';
//
// // project imports
// import NavigationScroll from './layout/NavigationScroll';
//
// import ThemeCustomization from './themes';

// import Crud from './crud/CrudDashboard';
import Dash from './dash/Dashboard';

// auth provider

// ==============================|| APP ||============================== //

// export default function App() {
//     return (
//         <ThemeCustomization>
//             <NavigationScroll>
//                 <>
//                     <RouterProvider router={router} />
//                 </>
//             </NavigationScroll>
//         </ThemeCustomization>
//     );
// }

export default function App() {
    return (
        <Dash></Dash>
    );
}
