import { createReducer } from '@reduxjs/toolkit';
import { authenticate, authSuccessAction, logoutAction, setAuthRedirectPath, authStateRestored } from '../actions/auth';

interface AuthState {
    token: string | null;
    userId: string | null;
    error: string | null | undefined;
    loading: boolean;
    authRedirectPath: string;
    restoringAuthState: boolean;
}

const initialState: AuthState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/',
    restoringAuthState: true
};

const reducer = createReducer(initialState, builder => {
    builder.addCase(authenticate.pending, state => {
        state.error = null;
        state.loading = true;
    })
    builder.addCase(authSuccessAction, (state, action) => {
        state.token = action.payload.idToken;
        state.userId = action.payload.userId;
        state.error = null;
        state.loading = false;
    })
    builder.addCase(authenticate.rejected, (state, action) => {
        state.error = action.payload?.error.message;
        state.loading = false;
    })
    builder.addCase(logoutAction, state => {
        state.token = null;
        state.userId = null;
    })
    builder.addCase(setAuthRedirectPath, (state, action) => {
        state.authRedirectPath = action.payload;
    })
    builder.addCase(authStateRestored, state => {
        state.restoringAuthState = false;
    })
});

export default reducer;