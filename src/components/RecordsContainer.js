import { List } from '@mui/material';
import { Pagination } from '@mui/material';

import Record from './Record';

export default function RecordsContainer({ recordPages, fetchRecords, state, dispatch }) {
  const changePage = (event, page) => {
    fetchRecords(page)
  }

  return (
    <>
      <h2>Records</h2>
      <Pagination count={recordPages} onChange={changePage}></Pagination>
      <List
        style={{
          backgroundColor: '#f5f5f5',
          height: 'calc(100vh - 12rem)',
          overflow: 'scroll',
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
    </>
  );
}
