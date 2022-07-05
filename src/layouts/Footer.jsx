import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Container from "@mui/material/Container";

const footerItems = ["Privacy", "|", "Contact", "|", "Version 1.0.0"];

const getWidth = (item) => {
  if (item === "|") return 10;
  if (item === "Version 1.0.0") return 100;
  return 70;
};

function Footer() {
  return (
    <footer>
      <Container
        component="sub"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <List
          sx={{
            bgcolor: "background.default",
            display: "flex",
          }}
        >
          {footerItems.map((item, index) => (
            <ListItem
              key={index.toString()}
              sx={{
                pl: 0,
                pr: 0,
                width: getWidth(item),
              }}
            >
              {item.toUpperCase()}
            </ListItem>
          ))}
        </List>
      </Container>
    </footer>
  );
}
export default Footer;