import React from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { sleep,updateTopic } from "../../app/api/backendApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditTopic(props) {
  const { handleClose, open, topic } = props;

  const [initialValues, setInitialValues] = React.useState({
    text: "",
    id: 0,
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    if (topic) {
      setInitialValues(topic);
    }
  }, [topic]);

  const validationSchema = Yup.object().shape({
    text: Yup.string().required("Topic Name is required"),
  });

  const onSubmit = async (values) => {
    await sleep(1500);
    if (values.text === topic.text) {
      toast.info("No changes to update!",{ position: "bottom-center",
        autoClose: 1000});       
    } else {
      updateTopic(topic.id, values)
        .then((response) => {
          toast.success("Topic updated successfully!",{ position: "bottom-center",
        autoClose: 1000});  
        })
        .catch((error) => {
          toast.error("Unable to update topic!",{ position: "bottom-center",
          autoClose: 1000});  
        })
        .finally(() => {
         
        });
        await sleep(1500);
        navigate("/dashboard");
        navigate("/topic");
    }
  };

  return (
    <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle id={"edit-topic"}>Edit Topic</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  backgroundColor: "background.default",
                  display: "flex",
                  flexDirection: "column",
                  width: "500px",
                  justifyContent: "center",
                }}
              >
                <Container maxWidth="md">
                  <TextField
                    error={Boolean(touched.text && errors.text)}
                    fullWidth
                    helperText={touched.text && errors.text}
                    label="Topic Text"
                    margin="normal"
                    name="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.text}
                    variant="standard"
                  />
                </Container>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                size="small"
                variant="contained"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                type="submit"
                disabled={isSubmitting}
                autoFocus
              >
                Update
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
      <ToastContainer/>
    </Dialog>
  );
}

export default EditTopic;
