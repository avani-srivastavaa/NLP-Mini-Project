import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/theme/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
