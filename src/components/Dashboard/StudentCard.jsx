import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";

const StudentCard = (props) => {
  const { stucount } = props;
  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "background.default",
      }}
      {...props}
    >
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h7">
              NO OF STUDENTS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {stucount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: orange[600],
              }}
            >
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
