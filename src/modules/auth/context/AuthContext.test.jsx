import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock de localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Wrapper para pruebas de hooks
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  test('debería iniciar sin usuario autenticado', () => {
    render(<AuthProvider>
      <TestComponent />
    </AuthProvider>);
    
    expect(screen.getByText('Usuario: null')).toBeInTheDocument();
    expect(screen.getByText('Cargando: false')).toBeInTheDocument();
  });

  test('debería cargar el usuario desde localStorage al iniciar', () => {
    const mockUser = { id: 1, name: 'Test User', type: 'volunteer' };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
    
    render(<AuthProvider>
      <TestComponent />
    </AuthProvider>);
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('voluntAppUser');
    expect(screen.getByText(`Usuario: ${JSON.stringify(mockUser)}`)).toBeInTheDocument();
  });

  test('debería manejar errores al parsear datos corruptos del localStorage', () => {
    // Simular datos corruptos en localStorage
    mockLocalStorage.getItem.mockReturnValueOnce('datos-corruptos');
    console.error = jest.fn();
    
    render(<AuthProvider>
      <TestComponent />
    </AuthProvider>);
    
    expect(console.error).toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('voluntAppUser');
    expect(screen.getByText('Usuario: null')).toBeInTheDocument();
  });

  test('la función login debería actualizar el estado del usuario', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = { id: 2, name: 'Logged In User', type: 'company' };
    
    await act(async () => {
      const response = await result.current.login(mockUser);
      expect(response).toEqual({ success: true, user: mockUser });
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('voluntAppUser', JSON.stringify(mockUser));
  });

  test('la función logout debería eliminar el usuario', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Primero establecemos un usuario
    act(() => {
      result.current.setUser({ id: 3, name: 'User to Logout' });
    });
    
    // Luego cerramos sesión
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('voluntAppUser');
  });

  test('isCompany debería identificar correctamente a usuarios tipo empresa', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Usuario que no es empresa
    act(() => {
      result.current.setUser({ id: 4, name: 'Volunteer', type: 'volunteer' });
    });
    expect(result.current.isCompany()).toBe(false);
    
    // Usuario tipo company
    act(() => {
      result.current.setUser({ id: 5, name: 'Company', type: 'company' });
    });
    expect(result.current.isCompany()).toBe(true);
    
    // Usuario tipo empresa
    act(() => {
      result.current.setUser({ id: 6, name: 'Empresa', userType: 'empresa' });
    });
    expect(result.current.isCompany()).toBe(true);
  });

  test('isAuthenticated debería indicar correctamente si hay un usuario autenticado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Sin usuario
    expect(result.current.isAuthenticated()).toBe(false);
    
    // Con usuario
    act(() => {
      result.current.setUser({ id: 7, name: 'Auth User' });
    });
    expect(result.current.isAuthenticated()).toBe(true);
  });
});

// Componente auxiliar para probar el contexto
function TestComponent() {
  const { user, loading } = useAuth();
  return (
    <div>
      <div>Usuario: {JSON.stringify(user)}</div>
      <div>Cargando: {loading.toString()}</div>
    </div>
  );
}
