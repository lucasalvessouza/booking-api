'use client';

import { format } from 'date-fns';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle} from '@mui/material';

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  technician: {
    name: string;
    role: string;
  }
}

interface BookingDetailsProps {
 readonly openDialog: boolean;
 readonly onClose: () => void;
 readonly bookingDetail: Booking | undefined;
}

export default function BookingDetails({ openDialog, onClose, bookingDetail }: BookingDetailsProps) {

 return (
  <Dialog open={openDialog} onClose={onClose} fullWidth>
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
       <Button onClick={onClose}>Close</Button>
     </DialogActions>
   </Dialog>
 )

}