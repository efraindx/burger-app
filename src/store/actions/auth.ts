import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

interface AuthenticateActionType {
    email: string;
    password: string;
    isSignUp: boolean;
}

interface AuthenticateActionResponseType {
    idToken: string;
    localId: string;
    expiresIn: number;
}

export const setAuthRedirectPath = createAction<string>('SET_AUTH_REDIRECT_PATH');

export const authSuccessAction = createAction('AUTH_SUCCESS', (args: AuthenticateActionResponseType) => {
    return {
        payload: {
            idToken: args.idToken,
            userId: args.localId
        }
    }
});

const authSuccess = createAsyncThunk<void, AuthenticateActionResponseType>(
    'auth/authSuccess',
    async (args, thunkAPI) => {
        thunkAPI.dispatch(checkAuthTimeout({ expirationTime: args.expiresIn }));
        thunkAPI.dispatch(authSuccessAction(args));
    }
);

export const logoutAction = createAction('AUTH_LOGOUT');

export const logout = createAsyncThunk<void>(
    'auth/logout',
    async (args, thunkAPI) => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
        thunkAPI.dispatch(logoutAction());
    }
);

interface CheckAuthTimeoutActionType {
    expirationTime: number
}

const checkAuthTimeout = createAsyncThunk<void, CheckAuthTimeoutActionType>(
    'auth/checkAuthTimeout',
    async (args, thunkAPI) => {
        setTimeout(() => {
            thunkAPI.dispatch(logout());
        }, args.expirationTime * 1000);
    }
);

interface GoogleAuthResponseError {
    error: {
        code: number;
        message: string;
    }
}

export const authenticate = createAsyncThunk<
    void, 
    AuthenticateActionType,
    {
        rejectValue: GoogleAuthResponseError | undefined
    }
>(
    'auth/authenticate',
    async (args, thunkAPI) => {
        const authData = {
            email: args.email,
            password: args.password,
            returnSecureToken: true
        };
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBK5zHYEIcQONzGeoZV2GhzKrU-54WwRA0';
        if (!args.isSignUp) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBK5zHYEIcQONzGeoZV2GhzKrU-54WwRA0';
        }

        try {
            const response = await axios.post<AuthenticateActionResponseType>(url, authData);

            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate.toString());
            localStorage.setItem('userId', response.data.localId);

            thunkAPI.dispatch(authSuccess(response.data));
        } catch (err) {
            const error: AxiosError<GoogleAuthResponseError> = err; // cast the error for access
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const authStateRestored = createAction('AUTH_STATE_RESTORED');

export const authCheckState = createAsyncThunk<void>(
    'auth/authCheckState',
    async (args, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) {
            thunkAPI.dispatch(logout());
        } else {
            let expirationDateValue = localStorage.getItem('expirationDate');
            if (expirationDateValue) {
                const expirationDate = new Date(expirationDateValue);
                if (expirationDate <= new Date()) {
                    thunkAPI.dispatch(logout());
                } else {
                    const userId = localStorage.getItem('userId');
                    if (userId) {
                        const expirationTime = (expirationDate.getTime() - new Date().getTime()) / 1000;
                        thunkAPI.dispatch(authSuccess({
                            idToken: token,
                            localId: userId,
                            expiresIn: expirationTime
                        }))
                    }
                }
            }
        }
        thunkAPI.dispatch(authStateRestored());
    }
);