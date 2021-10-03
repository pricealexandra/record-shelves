import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
} from '@mui/material';

export default function Record({ record, shelf, state, dispatch }) {
  return (
    <ListItem key={record.id}>
      <Card sx={{ width: '300px', margin: '0 auto' }}>
        <CardContent>
          <p>Title: {record.title}</p>
          <p>Artist(s):{record.artists.join(', ')}</p>
          <p>Label: {record.label}</p>
          <p>Formats: {record.formats.join(', ')}</p>
        </CardContent>

        <CardActions>
          {shelf ? (
            <Button
              onClick={() =>
                dispatch({
                  type: 'removeRecordFromShelf',
                  shelfId: shelf.id,
                  recordId: record.id,
                })
              }
            >
              Remove
            </Button>
          ) : Object.keys(state.shelves).length ? (
            <FormControl style={{ minWidth: '140px' }}>
              <InputLabel id="add-to-shelf">Add to shelf</InputLabel>
              <Select
                labelId="add-to-shelf"
                label="Add to shelf"
                data-testid="add-shelf"
                value=""
                onChange={evt => {
                  dispatch({
                    type: 'addRecordToShelf',
                    shelfId: evt.target.value,
                    recordId: record.id,
                  })
                  dispatch({
                    type: 'updateShelvedRecords',
                    shelvedRecord: record,
                  })
                }
                }
              >
                {Object.values(state.shelves).map(option => (
                  <MenuItem key={option.id} value={option.id} disabled={option.records.includes(record.id)}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </CardActions>
      </Card>
    </ListItem>
  );
}

