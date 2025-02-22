import type React from "react";
import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import { useAppDispatch } from "../redux/hooks";
import { fetchTickets } from "../redux/ticketsSlice";
import axios from "axios";
import type { Ticket } from "../redux/ticketsSlice";
import { apiUrl } from "../config";

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  existingTicket?: Ticket | null;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const TicketModal: React.FC<TicketModalProps> = ({ open, onClose, existingTicket }) => {
  const dispatch = useAppDispatch();
  
  const [ticketData, setTicketData] = useState<Ticket>({
    id: 0,
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    if (existingTicket) {
      setTicketData(existingTicket);
    } else {
      setTicketData({
        id: 0,
        title: "",
        description: "",
        completed: false,
      });
    }
  }, [existingTicket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketData({ ...ticketData, completed: e.target.value === "completed" });
  };

  const handleSubmit = async () => {
    try {
      if (existingTicket) {
        await axios.put(`${apiUrl}/v1/tickets/${ticketData.id}`, ticketData);
      } else {
        await axios.post(`${apiUrl}/v1/tickets`, ticketData);
      }
      dispatch(fetchTickets("All"));
      onClose();
    } catch (error) {
      console.error("Error saving ticket", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <TextField label="Title" name="title" fullWidth margin="normal" value={ticketData.title} onChange={handleChange} />
        <TextField label="Description" name="description" fullWidth multiline rows={3} margin="normal" value={ticketData.description} onChange={handleChange} />
        
        <TextField select label="Status" name="status" fullWidth margin="normal" value={ticketData.completed? "completed" : "inProgress"} onChange={handleStatusChange}>
          <MenuItem value="inProgress">In progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
          {existingTicket ? "Update Ticket" : "Add Ticket"}
        </Button>
      </Box>
    </Modal>
  );
};

export default TicketModal;
