'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ButtonGroup
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import {
  DateTimePicker
} from '@mui/x-date-pickers';
import toast from 'react-hot-toast';
import {
  getAllTechnicianroles,
  getAllBookings,
  createBooking,
  getBookingDetails,
  deleteBooking
} from '@/lib/api';

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
}

interface TechnicianRole {
  id: string;
  name: string;
}

const DashboardPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roles, setRoles] = useState<TechnicianRole[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBookingDetailDialog, setOpenBookingDetailDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs);
  const [bookingDetail, setBookingDetail] = useState();

  useEffect(() => {
    fetchBookings();
    fetchTechnicianRoles();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings()
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const fetchTechnicianRoles = async () => {
    try {
      const data = await getAllTechnicianroles()
      setRoles(data);
    } catch (error) {
      toast.error('Failed to fetch technician roles');
    }
  };

  const handleAddBooking = async () => {
    try {
      if (!selectedRole) {
        toast.error('Please select a technician role');
        return;
      }
      if (!startTime) {
        toast.error('Please select a start time');
        return;
      }
      await createBooking({
        role_id: selectedRole,
        start_time: startTime.format('YYYY-MM-DD HH:mm:ss')
      })
      toast.success('Booking created successfully');
      fetchBookings();
      setOpenDialog(false);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create booking';
      toast.error(message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleDetails = async (id: string) => {
    try {
      setBookingDetail(undefined)
      const data = await getBookingDetails(id)
      setBookingDetail(data);
      setOpenBookingDetailDialog(true)
    }
    catch (error) {
      toast.error('Failed to fetch booking details');
    }
  }

  return (
    <Box p={4}>
      <Typography variant="h3" mb={4}>Dashboard</Typography>

      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Add New Booking
      </Button>

      <TableContainer mt={4}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{format(booking.start_time, "PPPpp")}</TableCell>
                <TableCell>{format(booking.end_time, "PPPpp")}</TableCell>
                <TableCell>
                <ButtonGroup variant="contained" color="primary">
                    <Button onClick={() => handleDetails(booking.id)} color="primary" variant="outlined">
                      Details
                    </Button>
                    <Button onClick={() => handleDeleteBooking(booking.id)} color="error" variant="outlined">
                      Delete
                    </Button>
                </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Add New Booking</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Technician Role</InputLabel>
            <Select
              value={selectedRole}
              label="Technician Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <DateTimePicker 
              value={startTime}
              onChange={(date: any) => setStartTime(date)}
              label="Date"
              
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBooking} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBookingDetailDialog} onClose={() => setOpenBookingDetailDialog(false)} fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        {
          bookingDetail && (
            <DialogContent>
              <Typography variant='body1'>Technician: {bookingDetail?.technician?.name} / {bookingDetail?.technician?.role}</Typography>
              <Typography>Start Time: {format(bookingDetail.start_time, "PPPpp")}</Typography>
              <Typography>End Time: {format(bookingDetail.end_time, "PPPpp")}</Typography>
            </DialogContent>
          )
        }

        <DialogActions>
          <Button onClick={() => setOpenBookingDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
