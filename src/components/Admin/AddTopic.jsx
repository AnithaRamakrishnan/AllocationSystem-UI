import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { sleep,saveTopic } from "../../app/api/backendApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddTopic() {
  const initialValues = {
    topicText: "",
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    topicText: Yup.string().required("Topic Text is required"),
  });

  const onSubmit = async (values) => {
    await sleep(1500);
    saveTopic({
      TopicName: values.topicText,
    })
      .then((response) => {        
        toast.success("Topic saved successfully!",{ position: "bottom-center",
        autoClose: 1000});   

      })
      .catch((error) => {
        toast.error("Unable to save topic!",{ position: "bottom-center",
        autoClose: 1000});         
      })
      .finally(() => {   
        
      });
      await sleep(1500);
      navigate("/topic");
  };
  
const CancelSave = () => {
  navigate("/topic")    
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        width: "500px",
        justifyContent: "center",
      }}
    >
      <Box>
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
            touched,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                error={Boolean(touched.topicText && errors.topicText)}
                fullWidth
                helperText={touched.topicText && errors.topicText}
                label="Topic Text"
                margin="normal"
                name="topicText"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.topicText}
                variant="standard"
              />
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={CancelSave}
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  type="submit"
                  size="small"
                  autoFocus
                >
                  Save
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <ToastContainer style={{ width: "500px"}} />
    </Box>
  );
}

export default AddTopic;
