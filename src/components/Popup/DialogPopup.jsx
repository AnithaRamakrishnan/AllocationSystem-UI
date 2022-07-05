import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function DialogPopup({ content, handleClose, handleConfirm, open, title }) {
  return (
    <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
      <DialogTitle id={`Delete-confirm-${title}-title`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={`Delete-confirm-${title}-desc`}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          No
        </Button>
        <Button color="secondary" onClick={handleConfirm} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogPopup;
