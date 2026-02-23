import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'http://localhost:5000/api/tasks';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (token) => {
  const res = await axios.get(BASE, { headers: { Authorization: token } });
  return res.data;
});

export const createTask = createAsyncThunk('tasks/create', async ({ token, data }) => {
  const res = await axios.post(BASE, data, { headers: { Authorization: token } });
  return res.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ token, id, data }) => {
  const res = await axios.put(`${BASE}/${id}`, data, { headers: { Authorization: token } });
  return res.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async ({ token, id }) => {
  await axios.delete(`${BASE}/${id}`, { headers: { Authorization: token } });
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
