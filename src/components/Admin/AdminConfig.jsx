import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { postAdminConfig, getAdminSettings } from "../../app/api/backendApi";
import moment from "moment";

const AdminConfig = () => {
  const [initialValues, setinitialValues] = useState({
    teamSize: "",
    noOfPreferences: "",
    lastSubmissionDate: new Date(),
    noOfGroups: "",
    isTopicMultiple: "false",
    isAllocationDone: false,
    isTeamSizeUsed: false,
    isPreferenceSelected: false,
  });

  useEffect(() => {
    getAdminSettings().then((response) => {
      setinitialValues({
        ...response,
        lastSubmissionDate: new Date(response.lastSubmissionDate),
      });
    });
  }, []);

  const validationSchema = Yup.object().shape({
    teamSize: Yup.number().max(255).required("Group Size is required"),
    noOfPreferences: Yup.number().required("No Of Preferences is required"),
    lastSubmissionDate: Yup.string().required("Submission Date is required"),
    noOfGroups: Yup.number("No Of Groups must be a Numeric").when(
      "isTopicMultiple",
      {
        is: (isTopicMultiple) => isTopicMultiple === "Multiple",
        then: Yup.number().required("No Of Groups is required"),
      }
    ),
  });

  const onSubmit = async (values) => {
    postAdminConfig({
      teamSize: Number(values.teamSize),
      noOfPreferences: Number(values.noOfPreferences),
      lastSubmissionDate: values.lastSubmissionDate,
      noOfGroups: Number(
        values.isTopicMultiple === "true" ? values.noOfGroups : 0
      ),
      isTopicMultiple: values.isTopicMultiple === "true" ? true : false,
      isAllocationDone: values.isAllocationDone,
    })
      .then((response) => {        
        toast.success("Configuration details saved successfully!",{ position: "bottom-center",
        autoClose: 1000});
      })
      .catch((error) => {
        toast.error("Unable to save config details!",{ position: "bottom-center",
          autoClose: 1000});        
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    error={Boolean(
                      touched.noOfPreferences && errors.noOfPreferences
                    )}
                    helperText={
                      touched.noOfPreferences && errors.noOfPreferences
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.noOfPreferences}
                    label={"No Of Preferences"}
                    disabled={values.isPreferenceSelected}
                    fullWidth
                    id="noOfPreferences"
                    name="noOfPreferences"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="lastSubmissionDate"
                    label="Submission Date and Time"
                    type="datetime-local"
                    value={moment(values.lastSubmissionDate).format(
                      "yyyy-MM-DDTHH:mm"
                    )}
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(
                      touched.lastSubmissionDate && errors.lastSubmissionDate
                    )}
                    helperText={
                      touched.lastSubmissionDate && errors.lastSubmissionDate
                    }
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={handleChange}
                    value={values.teamSize}
                    label={"Each Group Size"}
                    disabled={values.isTeamSizeUsed}
                    fullWidth
                    id="teamSize"
                    name="teamSize"
                    error={Boolean(touched.teamSize && errors.teamSize)}
                    helperText={touched.teamSize && errors.teamSize}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isAllocationDone}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldValue("isAllocationDone", true);
                          } else {
                            setFieldValue("isAllocationDone", false);
                          }
                        }}
                      />
                    }
                    label="Mark As Completed"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel id="isTopicMultipleGroup">Group Type</FormLabel>
                  <RadioGroup
                    aria-labelledby="isTopicMultipleGroup"
                    defaultValue="false"
                    row
                    name="isTopicMultiple"
                    value={values.isTopicMultiple}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Multiple"
                    />
                  </RadioGroup>
                </Grid>
                {values.isTopicMultiple === "true" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      onChange={handleChange}
                      value={values.noOfGroups}
                      label={"No Of Groups"}
                      fullWidth
                      id="noOfGroups"
                      name="noOfGroups"
                      error={Boolean(touched.noOfGroups && errors.noOfGroups)}
                      helperText={touched.noOfGroups && errors.noOfGroups}
                      onBlur={handleBlur}
                    />
                  </Grid>
                )}
              </Grid>
              <Button
                fullWidth
                color="primary"
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Box>
      <ToastContainer style={{ width: "400px"}}/>
    </Container>
  );
};
export default AdminConfig;
