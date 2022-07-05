import * as React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  MenuItem,
  Grid,
  Link,
  Avatar,
  Typography,
} from "@mui/material";
import { get } from "lodash";
import { Formik, Field } from "formik";
import { sleep, register } from "../../app/api/backendApi";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomizedSelectForFormik = ({
  children,
  form,
  field,
  label,
  errors,
  touched,
}) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  const error = get(touched, field.name) && !!get(errors, field.name);
  const helperText = get(touched, field.name) && get(errors, field.name);
  return (
    <TextField
      name={name}
      label={label}
      id={name}
      fullWidth
      select
      value={value}
      error={error}
      helperText={helperText}
      onChange={(e) => {
        setFieldValue(name, e.target.value);
      }}
    >
      {children}
    </TextField>
  );
};

function Register() {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: "Student",
      description: "Student",
    },
    {
      id: "Supervisor",
      description: "Supervisor",
    },
  ];
  const courses = [
    {
      id: "Cloud Computing",
      description: "Cloud Computing",
    },
    {
      id: "Advance Computer Science",
      description: "Advance Computer Science",
    },
    {
      id: "Human Computer Interaction",
      description: "Human Computer Interaction",
    },
    {
      id: "Advance Software Engineering",
      description: "Advance Software Engineering",
    },
  ];
  const academicYears = [
    {
      id: "2021-2022",
      description: "2021-2022",
    },
    {
      id: "2022-2023",
      description: "2022-2023",
    },
  ];
  const titles = [
    {
      id: "Mr",
      description: "Mr",
    },
    {
      id: "Mrs",
      description: "Mrs",
    },
    {
      id: "Miss",
      description: "Miss",
    },
    {
      id: "Mx",
      description: "Mx",
    },
    {
      id: "Sir",
      description: "Sir",
    },
    {
      id: "Dr",
      description: "Dr",
    },
  ];

  const initialValues = {
    title: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userType: "",
    employeeID: "",
    studentNumber: "",
    academicYear: "",
    course: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(30)
      .required("Email is required")
      .matches(/^[a-zA-Z0-9_.+-]+@(student.le|leicester)\.ac.uk$/,"Must be valid university email id")
      ,
    password: Yup.string("Enter your password")
      .min(8, "Password should be of minimum 8 characters length")
      .max(30)
      .required("Password is required").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
      ),
    firstName: Yup.string()
      .max(75)
      .required("First Name is required")
      .matches(/^[aA-zZ\s]+$/, "Please enter alphabets"),
    lastName: Yup.string()
      .max(75)
      .required("Last Name is required")
      .matches(/^[aA-zZ\s]+$/, "Please enter alphabets"),
    userType: Yup.string().required("Select User Type"),
    studentNumber: Yup.number("ID Must be a Numeric").when("userType", {
      is: (userType) => userType === "Student",
      then: Yup.number().required("Student Number is required"),
    }),
    employeeID: Yup.number("ID Must be a Numeric").when("userType", {
      is: (userType) => userType === "Supervisor",
      then: Yup.number().required("Employee ID is required"),
    }),
    academicYear: Yup.string().when("userType", {
      is: (userType) => userType === "Student",
      then: Yup.string().required("Select Academic Year"),
    }),
    course: Yup.string().when("userType", {
      is: (userType) => userType === "Student",
      then: Yup.string().required("Select Course"),
    }),
  });

  const onSubmit = async (values) => {
    register({
      title: values.title,
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      userType: values.userType,
      employeeID: Number(values.employeeID),
      studentNumber: Number(values.studentNumber),
      academicYear: values.academicYear,
      course: values.course,
    })
      .then((response) => {
        toast.success("User registered successfully!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      })
      .catch((error) => {
        toast.error("User registration failed!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      })
      .finally(() => {});
    await sleep(1500);
    navigate("/login");
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
        }}
      >
        <Avatar sx={{ mb: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
          Sign Up
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <Field
                    name="title"
                    component={CustomizedSelectForFormik}
                    label="Title"
                    error={errors}
                    touched={touched}
                  >
                    {titles.map((x, index) => {
                      return (
                        <MenuItem key={index} value={x.id}>
                          {x.description}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"                    
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="userType"
                    component={CustomizedSelectForFormik}
                    label="User Type"
                    error={errors}
                    touched={touched}
                  >
                    {userTypes.map((x, index) => {
                      return (
                        <MenuItem key={index} value={x.id}>
                          {x.description}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>
                {}
                {values.userType === "Supervisor" ? (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={Boolean(touched.employeeID && errors.employeeID)}
                      fullWidth
                      helperText={touched.employeeID && errors.employeeID}
                      label="Employee ID"
                      name="employeeID"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.employeeID}
                      inputProps={{ maxLength: 15 }}
                    />
                  </Grid>
                ) : (
                  values.userType === "Student" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          error={Boolean(
                            touched.studentNumber && errors.studentNumber
                          )}
                          fullWidth
                          helperText={
                            touched.studentNumber && errors.studentNumber
                          }
                          label="Student Number"
                          name="studentNumber"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.studentNumber}
                          inputProps={{ maxLength: 15 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="academicYear"
                          component={CustomizedSelectForFormik}
                          label="Academic Year"
                          error={errors}
                          touched={touched}
                        >
                          {academicYears.map((x, index) => {
                            return (
                              <MenuItem key={index} value={x.id}>
                                {x.description}
                              </MenuItem>
                            );
                          })}
                        </Field>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="course"
                          component={CustomizedSelectForFormik}
                          label="Course"
                          error={errors}
                          touched={touched}
                        >
                          {courses.map((x, index) => {
                            return (
                              <MenuItem key={index} value={x.id}>
                                {x.description}
                              </MenuItem>
                            );
                          })}
                        </Field>
                      </Grid>
                    </>
                  )
                )}
              </Grid>
              <Button
                disabled={isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Account
              </Button>
            </form>
          )}
        </Formik>

        <Grid container justifyContent="flex-end">
          Already have an account? &nbsp;
          <Link
            sx={{ fontSize: 16 }}
            component="button"
            variant="body2"
            onClick={() => {
              navigate("/login", { replace: true });
            }}
          >
            Log In
          </Link>
        </Grid>
      </Box>
      <ToastContainer style={{ width: "400px" }} />
    </Container>
  );
}

export default Register;
