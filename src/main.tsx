import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MantineColorScheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

// Retrieve the saved color scheme from localStorage or default to 'dark'
const savedColorScheme = localStorage.getItem('colorScheme') || 'dark';

createRoot(document.getElementById('root')!).render(
  <MantineProvider defaultColorScheme={savedColorScheme as MantineColorScheme}>
    <Notifications />
    <App />
  </MantineProvider>
);