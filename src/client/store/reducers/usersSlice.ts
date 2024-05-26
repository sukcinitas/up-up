import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import axios from 'axios';

export interface AppState {
    userId: string,
    username: string,
    starredPolls: string[],
}

export const initialState: AppState = {
    userId: '',
    username: '',
    starredPolls: [],
};

export const fetchStarredPolls = createAsyncThunk(
    'users/fetchStarredPolls',
    async (username: string) => {
    if (!username) {
        return [];
    }
      const response = await axios.get(`/api/user/profile/${username}`);
      return response.data.user[0].starredPolls || [];
    },
);


export const fetchUser = createAsyncThunk(
    'users/fetchUser',
    async() => {
        const response = await axios.get('/api/user/login');
        if (response.data.user?.username) {
            const profileResponse = await axios.get(`/api/user/profile/${response.data.user.username}`);
            return profileResponse.data.user[0];
        } else {
            throw new Error('No user');
        }
    },
);

export const usersSlice = createSlice({
    name: 'user',
    initialState: { ...initialState },
    reducers: {
        logoutCurrentUser: (state) => {
            state.username = '';
            state.userId = '';
            state.starredPolls = [];
        },
        setCurrentUser: (state, action) => {
            const { username, userId } = action.payload;
            state.username = username;
            state.userId = userId;
        },
        setStarredPolls: (state, action) => {
            const { starredPolls } = action.payload;
            state.starredPolls = starredPolls;
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<AppState>) => {
        builder
        .addCase(fetchStarredPolls.fulfilled, (state, action) => {
            state.starredPolls = action.payload;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.username = action.payload.username;
            state.userId = action.payload._id;
            state.starredPolls = action.payload.starredPolls;
        })
        .addCase(fetchUser.rejected, (state) => {
            state.username = '';
            state.userId = '';
            state.starredPolls = [];
        });
      },
})

export const { logoutCurrentUser, setCurrentUser, setStarredPolls } = usersSlice.actions;

export default usersSlice.reducer;
