import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import './index.css';
import router from './routes/routes';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <React.Suspense fallback={<div>Loading...</div>}> */}
    <RouterProvider router={router} />
    {/* </React.Suspense> */}
  </React.StrictMode>,
);
