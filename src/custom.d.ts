declare module 'notistack' {
  export interface SnackbarMessage {
    message: string;
    key: number;
    variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  }

  export interface SnackbarProviderProps {
    maxSnack?: number;
    children: React.ReactNode;
  }

  export interface UseSnackbarOptions {
    variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  }

  export function useSnackbar(): {
    enqueueSnackbar: (message: string, options?: UseSnackbarOptions) => void;
    closeSnackbar: (key?: string | number) => void;
  };

  export function SnackbarProvider(props: SnackbarProviderProps): JSX.Element;
} 