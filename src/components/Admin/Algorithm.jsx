import { Button, Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { sleep, AutoAllocation, getResult } from "../../app/api/backendApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Alogrithm = () => {
  const [result, setResult] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getResult().then((response) => {
      setResult(response);
      console.log(result);
    });
  }, []);

  const handleSubmit = async () => {
    const id = toast.loading("Running Algorithm.Please wait...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      className: "primaryColor",
    });
    await sleep(3000);
    AutoAllocation()
      .then((response) => {
        toast.update(id, {
          render:
            response.data === "Success"
              ? "Allocation Process Completed successfully!"
              : response.data,
          type:
            response.data === "Success"
              ? "success"
              : response.data.includes("Allocation Process Failed")
              ? "error"
              : "warn",
          isLoading: false,
          position: "top-center",
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        if (error.response) {
          toast.update(id, {
            render: "Error occured during allocation process!",
            type: "error",
            isLoading: false,
            position: "top-center",
            autoClose: 1000,
          });
        }
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
        boxShadow:
          "0px 2px 4px -1px rgb(0 0 0 / 12%), 0px 4px 5px 0px rgb(0 0 0 / 12%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          py: 1,
          display: "flex",
          mr: 1,
          justifyContent: "center",
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          sx={{ mr: 2 }}
        >
          Run Allocation Process
        </Button>

        <ToastContainer style={{ width: "500px", padding: "50px" }} />
      </Box>
      <Box
        sx={{
          py: 1,
          display: "flex",
          mr: 1,
          justifyContent: "center",
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
              <StyledTableCell />
                <StyledTableCell>Group</StyledTableCell>
                <StyledTableCell align="right">Topic</StyledTableCell>
                <StyledTableCell align="right">No Of Students</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {result.map((row) => (
            <Row key={row.group} row={row} />
          ))}              
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
export default Alogrithm;

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.groupName}
        </TableCell>
        <TableCell align="right">{row.topicName}</TableCell>
        <TableCell align="right">{row.students.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Student List
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>                    
                    <TableCell align="right">Final Topic from Selected Preference</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.students.map((stu) => (
                    <TableRow key={stu.studentName}>
                      <TableCell component="th" scope="row">
                        {stu.studentName}
                      </TableCell>                      
                      <TableCell align="right">{stu.matchedPreferenceOrder}</TableCell>                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// {
//   "groupName": "string",
//   "topicName": "string",
//   "students": [
//     {
//       "studentName": "string",
//       "matchedPreferenceOrder": 0
//     }
//   ]
// }
