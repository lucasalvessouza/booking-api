'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import {
  DateTimePicker
} from '@mui/x-date-pickers';
import toast from 'react-hot-toast';
import {
  getAllTechnicianroles,
  createBooking
} from '@/lib/api';

interface AddBookingProps {
  readonly openDialog: boolean;
  readonly onClose: () => void;
  readonly onFetchBookings: () => void;
}

interface TechnicianRole {
 id: string;
 name: string;
}

export default function AddBooking({ openDialog, onClose, onFetchBookings }: AddBookingProps) {
 const [selectedRole, setSelectedRole] = useState('');
 const [startTime, setStartTime] = useState<Dayjs | null>(dayjs);
 const [roles, setRoles] = useState<TechnicianRole[]>([]);

 useEffect(() => {
  fetchTechnicianRoles();
 }, []);

 const fetchTechnicianRoles = async () => {
   try {
     const data = await getAllTechnicianroles()
     setRoles(data);
   } catch {
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
     onFetchBookings();
     onClose();
   } catch (error) {
     //  eslint-disable-next-line @typescript-eslint/no-explicit-any
     const message = (error as any).response?.data?.detail || 'Failed to create booking';
     toast.error(message);
   }
 };

 return (
  <Dialog open={openDialog} onClose={onClose} fullWidth>
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
         onChange={(date) => setStartTime(date)}
         label="Date"
         
       />
     </FormControl>
   </DialogContent>

   <DialogActions>
     <Button onClick={onClose}>Cancel</Button>
     <Button onClick={handleAddBooking} variant="contained" color="primary">
       Add
     </Button>
   </DialogActions>
 </Dialog>
 )
}