import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: { username: null },
    reducers: {
        // setUserEmail: (state, action) => {
        //     state.email = action.payload;
        // },
        setUserName: (state, action) => {
            state.username = action.payload
        },
    },
})

export const { setUserName } = userSlice.actions

export default userSlice.reducer