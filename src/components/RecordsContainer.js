import { List, Pagination, Drawer, Button, Box } from '@mui/material';
import { blue } from '@mui/material/colors';

import Record from './Record';

export default function RecordsContainer({ recordPages, fetchRecords, state, dispatch, isRecordDrawerOpen, setIsRecordDrawerOpen }) {
  const changePage = (event, page) => {
    fetchRecords(page)
  }

  const records = (
    <Box sx={{width: '350px', backgroundColor: blue['100']}}>
      <div>
        <h2 style={{ display: 'inline-block', width: '60%', padding: '10px' }}>Record Catalog</h2>
        <Button onClick={() => setIsRecordDrawerOpen(false)} sx={{ display: {xs: 'inline-block', sm: 'none', backgroundColor: blue[50]}}} variant="outlined">Close</Button>
      </div>
      <Pagination count={recordPages} onChange={changePage} color="primary" sx={{paddingBottom: '10px'}} ></Pagination>
      <List
        style={{
          backgroundColor: blue['50'],
          overflow: 'scroll'
        }}
      >
        {state.displayedRecords.map(record => (
          <Record
            key={record.id}
            record={record}
            state={state}
            dispatch={dispatch}
          />
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={isRecordDrawerOpen}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        {records}
      </Drawer>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {records}
      </Drawer>
    </>
  );
}
