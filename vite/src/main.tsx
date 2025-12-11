import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

// project imports
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';

// std imports
import { log } from './stdlog';
import { isDev } from './stdvar';

// style + assets
import './index.css';
import 'assets/scss/style.scss';

// fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

log.info(`Running ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} build`);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            < ConfigProvider >
                <App />
            </ConfigProvider >
        </StyledEngineProvider>
    </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
<React.StrictMode>
    <StyledEngineProvider injectFirst>
        <App />
    </StyledEngineProvider>
</React.StrictMode>,
*/
