import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const withRouter = (component: () => ReactElement) => () => <BrowserRouter>{component()}</BrowserRouter>;
