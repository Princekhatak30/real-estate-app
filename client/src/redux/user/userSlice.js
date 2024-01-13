import { createSlice} from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        //signIn reducers
        signInStart: (state) => {
            state.loading= true
        },
        signInSuccess: (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error= null
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading= false
        },
        // update reducers
        updateUserStart: (state)=>{
            state.loading= true;
        },
        updateUserfailure: (state, action) => {
            state.error = action.payload
            state.loading= false;
        },
        updateUserSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading= false;
            state.error =null;
        },
        deleteUserStart: (state)=>{
            state.loading = true;
        },
        deleteuserSuccess: (state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error =null
        },
        deleteUserFailure: (state, action)=>{
            state.error = action.payload;
            state.loading= false
        },
        signoutUserStart: (state)=>{
            state.loading = true;
        },
        signoutuserSuccess: (state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error =null
        },
        signoutUserFailure: (state, action)=>{
            state.error = action.payload;
            state.loading= false
        },
    }
})

export const { signInStart, signInSuccess, signInFailure,updateUserStart, updateUserfailure, updateUserSuccess,  deleteUserStart,deleteuserSuccess, deleteUserFailure, signoutUserStart , signoutuserSuccess, signoutUserFailure  } = userSlice.actions;

export default userSlice.reducer