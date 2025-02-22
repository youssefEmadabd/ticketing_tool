import React, { useEffect } from "react";
import { Container, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography } from "@mui/material";
import TicketCard from "./components/TicketCard";
import TicketModal from "./components/TicketModal";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import type { Ticket } from "./redux/ticketsSlice";
import { fetchTickets, setStatusFilter } from "./redux/ticketsSlice";

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<null | any>(null);

  const dispatch = useAppDispatch();
  const { tickets, statusFilter, loading, error } = useAppSelector(state => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets(statusFilter));
  }, [statusFilter, dispatch]);

  return (
    <Container sx={{ mt: 4 }}>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select

          value={statusFilter === "All" ? statusFilter : statusFilter === true ? "Completed" : "Open"}
          onChange={(e) => dispatch(setStatusFilter(e.target.value as any === "Open" ? false : e.target.value as any === "Completed"? true : "All"))}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" sx={{ mb: 2, ml: 2 }} onClick={() => { setSelectedTicket(null); setModalOpen(true); }}>
        Add Ticket
      </Button>

      {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : (
        tickets.map((ticket: Ticket) => (
          <div key={ticket.id} onClick={() => { setSelectedTicket(ticket); setModalOpen(true); }}>
            <TicketCard ticket={ticket} />
          </div>
        ))
      )}

      <TicketModal open={isModalOpen} onClose={() => setModalOpen(false)} existingTicket={selectedTicket} />
    </Container>
  );
};

export default App;
