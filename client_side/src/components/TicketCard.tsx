import type React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { Ticket } from "../redux/ticketsSlice";

const getStatusIcon = (complete: boolean) => {
  switch (complete) {
    case false:
      return <AccessTimeIcon color="warning" />;
    case true:
      return <CheckCircleIcon color="success" />;
    default:
      return null;
  }
};

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <Card sx={{ minWidth: 275, mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{ticket.title}</Typography>
          <Chip label={ticket.completed? "Completed" : "Open"} color={!ticket.completed ? "primary" : "secondary"} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {ticket.description}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
          {getStatusIcon(ticket.completed)}
          <Typography variant="body2">Status: {ticket.completed ? "Completed" : "Open"}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
