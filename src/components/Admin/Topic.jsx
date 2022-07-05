import { useNavigate } from "react-router-dom";
import * as React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { getAllTopics, deleteTopic } from "../../app/api/backendApi";
import MUIDataTable from "mui-datatables";
import { Close, Edit } from "@mui/icons-material";
import clsx from "clsx";
import { createStyles, makeStyles } from "@mui/styles";
import DialogPopup from "../Popup/DialogPopup";
import EditTopic from "./EditTopic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      height: "14px",
      width: "14px",
    },
    button: {
      borderRadius: "50%",
      color: "#fff",
      height: "22px",
      padding: "4px",
      width: "24px",
      margin: "2px",
    },
    edit: {
      "&:hover": {
        background: theme.palette.colors.green[900],
      },
      background: theme.palette.colors.green[600],
    },
    delete: {
      "&:hover": {
        background: theme.palette.colors.red[900],
      },
      background: theme.palette.colors.red[600],
    },
  })
);

function Topic() {
  const navigate = useNavigate();
  const [topics, setTopics] = React.useState([]);
  const classes = useStyles();
  const [openToDelete, setOpenToDelete] = React.useState(false);
  const [openToEdit, setOpenToEdit] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState();
  const [topicToEdit, setTopicsToEdit] = React.useState();

  const onEditClick = (id) => {
    const topic = topics.find((x) => x.id === id);
    setTopicsToEdit(topic);
    setOpenToEdit(true);
  };

  const onDeleteClick = (id) => {
    setIdToDelete(id);
    setOpenToDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteTopic(Number(idToDelete))
      .then((res) => {
        toast.success("Topic deleted successfully!",{ position: "bottom-center",
        autoClose: 1000});  
      })
      .catch((err) => {
        toast.error("Unable to delete topic",{ position: "bottom-center",
        autoClose: 1000});  
      })
      .finally(() => {
        setOpenToDelete(false);
        setIdToDelete(undefined);
      });
  };

  const handleClose = (_, reason) => {
    if (reason === "escapeKeyDown" || reason === "backdropClick") {
      return;
    }
    setIdToDelete(undefined);
    setOpenToDelete(false);
    setTopicsToEdit(undefined);
    setOpenToEdit(false);
  };

  React.useEffect(() => {
    getAllTopics().then((response) => {
      setTopics(response);
    });
  }, [idToDelete]);

  const isAlreadyUsed = (id) => {
    return topics.find((qx) => qx.id === id).isAlreadyUsed;
  };

  const columns = [
    {
      name: "Topic",
      options: {
        filter: true,
      },
    },
    {
      name: "Action",
      options: {
        customBodyRender: (value) => {
          const isUsed = isAlreadyUsed(value);
          return (
            <Box>
              <IconButton
                disabled={isUsed}
                className={clsx(classes.button, classes.edit)}
                onClick={() => onEditClick(value)}
              >
                <Edit className={classes.icon} />
              </IconButton>
              <IconButton
                disabled={isUsed}
                className={clsx(classes.button, classes.delete)}
                onClick={() => onDeleteClick(value)}
              >
                <Close className={classes.icon} />
              </IconButton>
            </Box>
          );
        },
      },
    },
  ];

  const data = topics.map((topic) => [topic.text, topic.id]);

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    tableBodyHeight: "400px",
    tableBodyMaxHeight: "",
    selectableRows: "none",
    searchPlaceholder: "Search Topics",
    textLabels: {
      body: {
        noMatch: "No items to display",
      },
    },
  };

  return (
    <>
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
            justifyContent: "right",
            mr: 1,
          }}
        >
          <Button
            color="primary"
            size="medium"
            variant="contained"
            onClick={() => navigate("/add-topic")}
          >
            Add +
          </Button>
        </Box>
        <Box
          sx={{
            "& > div": {
              boxShadow: "none",
              borderRadius: "unset",
            },
            p: 1,
          }}
        >
          <MUIDataTable
            title={"Topics"}
            data={data}
            columns={columns}
            options={options}
          />
        </Box>
      </Box>
      <DialogPopup
        content={"Do you want to delete the topic?"}
        handleClose={handleClose}
        handleConfirm={handleConfirmDelete}
        open={openToDelete}
        title={"Delete topic?"}
      />
      <EditTopic
        open={openToEdit}
        topic={topicToEdit}
        handleClose={handleClose}        
      />
      <ToastContainer/>
    </>
  );
}

export default Topic;
