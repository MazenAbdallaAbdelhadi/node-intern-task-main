import { useMemo, useEffect, useReducer, useCallback } from 'react';
import {
  signOut,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from 'src/firebase';

import { AuthContext } from './auth-context';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user,
        },
      });
    });

    return () => unsubscribe();
  }, []);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const { user } = userCredential;
    const userData = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...userData,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      const userData = {
        id: user.uid,
        email: user.email,
        displayName: `${firstName} ${lastName}`,
        photoURL: user.photoURL,
      };

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...userData,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut(auth);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'firebase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      logout,
      loginWithGoogle: async () => {}, // TODO: implement google login
      loginWithGithub: async () => {}, // TODO: implement github login
      loginWithTwitter: async () => {}, // TODO: implement twitter login
      forgotPassword: async () => {}, // TODO: implement forgot password
      login,
      register,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
