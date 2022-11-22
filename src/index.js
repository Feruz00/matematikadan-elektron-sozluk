import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';

// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider>
<App />
  </ConfigProvider>
    
);
