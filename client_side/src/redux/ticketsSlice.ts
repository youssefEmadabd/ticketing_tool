import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../config";

// Ticket Type
export interface Ticket {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// State Type
interface TicketsState {
  tickets: Ticket[];
  statusFilter: boolean | "All";
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: TicketsState = {
  tickets: [],
  statusFilter: "All",
  loading: false,
  error: null,
};

// Fetch tickets from backend
export const fetchTickets = createAsyncThunk<Ticket[], boolean | string>(
  "tickets/fetchTickets",
  async (statusFilter, { rejectWithValue }) => {
    console.log(statusFilter);
    try {
      const response = await axios.get(`${apiUrl}/v1/tickets`,{
        params: statusFilter !== "All" ? { complete: statusFilter } : {},
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Create Slice
const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<TicketsState["statusFilter"]>) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setStatusFilter } = ticketsSlice.actions;

// Export reducer
export default ticketsSlice.reducer;
