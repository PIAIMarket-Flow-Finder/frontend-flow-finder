import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// Define a type for the slice state
interface FormState {
    package_name: string
}

// Define the initial state using that type
const initialState: FormState = {
    package_name: '',
}

export const testRedux = createSlice({
    name: 'test',
    initialState,
    reducers: {
        setValue(state, action : PayloadAction<string>) {
            state.package_name = action.payload
        },
    },
})

export const { setValue } = testRedux.actions

export default  testRedux.reducer