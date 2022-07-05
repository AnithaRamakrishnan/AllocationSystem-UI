import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  
  function AlertPopup({ content, handleClose, open, title }) {
    return (
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle id={`Alert-${title}-title`}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id={`Alert-${title}-desc`}>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default AlertPopup;
  