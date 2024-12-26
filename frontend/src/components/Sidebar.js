import { Paper, List, ListItem, ListItemText } from '@mui/material';

function Sidebar() {
  return (
    <Paper elevation={2}>
      <List>
        <ListItem button>
          <ListItemText primary="Generate Image" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="History" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Paper>
  );
}

export default Sidebar; 