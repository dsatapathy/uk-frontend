import { createSlice } from '@reduxjs/toolkit';


const featureFlags = createSlice({
    name: 'featureFlags',
    initialState: { ruleDebugger: false },
    reducers: { setFlag(state, { payload }) { const { key, value } = payload; state[key] = value; } }
});


export const { setFlag } = featureFlags.actions;
export default featureFlags.reducer;