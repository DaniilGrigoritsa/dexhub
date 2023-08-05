import { PropsWithChildren } from 'react';
import { Header, Sidebar } from './components';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="layout">
      <div className="layout-container">
        <Header />
        {children}
      </div>
      <Sidebar />
    </div>
  );
};
