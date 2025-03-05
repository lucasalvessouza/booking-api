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
  ButtonGroup,
} from '@mui/material';
import toast from 'react-hot-toast';
import {
  getAllBookings,
  getBookingDetails,
  deleteBooking
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ChatDialog from '@/app/components/Chat';
import AddBooking from '@/app/components/AddBooking';
import BookingDetails from '@/app/components/BookingDetails';

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
}

const DashboardPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openAddNewBookingDialog, setOpenAddNewBookingDialog] = useState(false);
  const [openBookingDetailDialog, setOpenBookingDetailDialog] = useState(false);
  const [bookingDetail, setBookingDetail] = useState();
  const { logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn && bookings.length === 0) {
      fetchBookings();
    }
  }, [isLoggedIn, bookings]);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings()
      setBookings(data);
    } catch {
      toast.error('Failed to fetch bookings');
    }
  };


  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch {
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
    catch {
      toast.error('Failed to fetch booking details');
    }
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection='row' alignContent='center' mb={4}>
        <Typography variant="h4">My Bookings</Typography>
        <Button variant="contained" color="primary" onClick={logout}>
          Logout
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-start" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
        <Button variant="contained" color="primary" onClick={() => setOpenAddNewBookingDialog(true)} sx={{ width: { xs: '100%', md: 'auto' } }}>
          Add New Booking
        </Button>
        <ChatDialog onUpdate={fetchBookings} />
      </Box>
      <TableContainer sx={{ mt: 4 }}>
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

      <AddBooking
        onClose={() => setOpenAddNewBookingDialog(false)}
        openDialog={openAddNewBookingDialog}
        onFetchBookings={fetchBookings}
      />

      <BookingDetails
        openDialog={openBookingDetailDialog}
        onClose={() => setOpenBookingDetailDialog(false)}
        bookingDetail={bookingDetail}
      />
    </Box>
  );
};

export default DashboardPage;
