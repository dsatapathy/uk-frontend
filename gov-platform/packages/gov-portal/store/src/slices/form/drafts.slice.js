import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    // key: `${formId}::${entityId}` → { values, updatedAt }
};


const drafts = createSlice({
    name: 'drafts',
    initialState,
    reducers: {
        saveDraft(state, { payload }) { const { key, values, updatedAt } = payload; state[key] = { values, updatedAt }; },
        clearDraft(state, { payload }) { delete state[payload]; }
    }
});


export const { saveDraft, clearDraft } = drafts.actions;
export default drafts.reducer;