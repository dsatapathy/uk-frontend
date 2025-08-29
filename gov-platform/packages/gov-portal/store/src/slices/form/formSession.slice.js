import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    formId: null,
    entityId: null,
    schemaVersion: '1.0.0',
    isSubmitting: false,
    lastSavedAt: null,
};


const formSession = createSlice({
    name: 'formSession',
    initialState,
    reducers: {
        startFormSession(state, { payload }) { return { ...state, ...payload }; },
        setSubmitting(state, { payload }) { state.isSubmitting = payload; },
        setLastSavedAt(state, { payload }) { state.lastSavedAt = payload; },
        endFormSession() { return initialState; }
    }
});


export const { startFormSession, setSubmitting, setLastSavedAt, endFormSession } = formSession.actions;
export default formSession.reducer;