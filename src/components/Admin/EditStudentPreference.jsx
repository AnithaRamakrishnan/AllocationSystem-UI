import * as React from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  FormControl,
  MenuItem,
  OutlinedInput,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  ListItemText,
  Typography,
  TextField,
  Autocomplete,
  Select,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  getAllTopics,
  getPreferencesByStudentId,
  SavePreferences,
  getAdminConfig,
  searchStudents,
} from "../../app/api/backendApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import clsx from "clsx";
import { Close } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      maxHeight: 450,
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto",
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function EditStudentPreference() {
  const [pref, setPref] = React.useState(0);
  const [topics, setTopics] = React.useState([]);
  const [selectedPref, setselectedPref] = React.useState([]);
  const [isstudent, issetstudent] = React.useState(false);
  const [getstudents, setgetstudents] = React.useState([]);
  const [searchedstudent, setsearchedstudent] = React.useState("");
  const classes = useStyles();

  React.useEffect(() => {
    searchStudents()
      .then((response) => {
        setgetstudents(response);
      })
      .catch();
    getAllTopics()
      .then((response) => {
        setTopics(response);
      })
      .catch((error) => {
        console.log(error);
      });

    getAdminConfig().then((response) => {
      setPref(response.noOfPreferences);
    });
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setselectedPref(value);
  };

  // const range = (size, startAt = 1) => {
  //   return [...Array(size).keys()].map((i) => i + startAt);
  // };

  const onStudentTextChange = (event, value) => {
    setsearchedstudent(value);
    console.log(value);
    if (value != null) {
      issetstudent(true);
      getPreferencesByStudentId(value.id).then((response) => {
        setselectedPref(response);
      });
    } else {
      issetstudent(false);
    }
  };
  const onSubmit = () => {
    console.log({ id: searchedstudent.id, topicPriorities: selectedPref });
    if (selectedPref.length === pref) {
      SavePreferences({ id: searchedstudent.id, topicPriorities: selectedPref })
        .then((response) => {
          toast.success("Preferences Saved Successfully!", {
            position: "bottom-center",
            autoClose: 1000,
          });
        })
        .catch((error) => {
          toast.error("Unable to save preferences!", {
            position: "bottom-center",
            autoClose: 3000,
          });
        })
        .finally(() => {
          issetstudent(false);
          setsearchedstudent(null);
        });
    } else {
      toast.warn("Please select " + pref + " preference(s) to save!", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          py: 3,
        }}
      >
        <Grid container spacing={2}>
        <Grid item xs={12} lg={9} margin={1}>
            <Autocomplete
              id="student"
              options={getstudents}
              disablePortal
              isOptionEqualToValue={(option, value) => option.id === value.id}
              style={{ width: "100%" }}
              onChange={onStudentTextChange}
              value={searchedstudent}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Student Name or Number"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

        {isstudent && (
          <Grid container spacing={2}>
            <Grid item xs={12} lg={9}>
              <FormControl sx={{ m: 1, width: "100%" }}>
                <InputLabel id="topic-label">Topics</InputLabel>
                <Select
                  labelId="topic-label"
                  id="topic"
                  multiple
                  fullWidth
                  value={selectedPref}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-topic" label="Topics" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {topics.length > 0 &&
                        selectedPref.map((value) => (
                          <Chip
                            key={value}
                            label={topics?.find((e) => e.id === value).text}
                            value={value}
                          />
                        ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {topics.map((name) => (
                    <MenuItem
                      key={name.id}
                      value={name.id}
                      disabled={selectedPref.length >= pref ? true : false}
                    >
                      <Checkbox checked={selectedPref.includes(name.id)} />
                      <ListItemText primary={name.text} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Button
                id="btn_save"
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                sx={{ m: 2 }}
                onClick={onSubmit}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} lg={10}>
              <TableContainer component={Paper} className={classes.paper}>
                {
                  <Table
                    sx={{ width: "100%" }}
                    stickyHeader
                    aria-label="Student table"
                  >
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>Topic Name</StyledTableCell>
                        <StyledTableCell style={{ width: 150 }} align="right">
                          Preference Order
                        </StyledTableCell>
                        <StyledTableCell style={{ width: 100 }}>
                          Remove
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPref.length === 0 ? (
                        <StyledTableRow>
                          <StyledTableCell colSpan={12}>
                            <Typography
                              variant="h6"
                              sx={{ style: { fontSize: 25 } }}
                            >
                              There is no data to display. Please add your
                              preferences
                            </Typography>
                          </StyledTableCell>
                        </StyledTableRow>
                      ) : (
                        selectedPref.length > 0 &&
                        topics.length > 0 &&
                        selectedPref.map((stu, index) => (
                          <StyledTableRow key={stu}>
                            <StyledTableCell>
                              {topics?.find((e) => e.id === stu).text}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell key={stu} align="right">
                              <IconButton
                                className={clsx(classes.button, classes.delete)}
                                onClick={() => {
                                  setselectedPref(
                                    selectedPref?.filter((a) => a !== stu)
                                  );
                                }}
                              >
                                <Close className={classes.icon} />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                }
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Box>
      <ToastContainer style={{ width: "400px" }} />
    </Container>
  );
}

export default EditStudentPreference;
