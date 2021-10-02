import { useCallback, useEffect, useReducer, useState } from 'react';

import { Container, Grid } from '@mui/material';

import { DragDropContext } from 'react-beautiful-dnd';

import { reducer } from './reducer';

import RecordsContainer from './components/RecordsContainer';
import Shelves from './components/Shelves';

export default function App() {
  const [totalRecordPages, setTotalRecordPages] = useState();
  const [recordPage, setRecordPage] = useState(1);

  const [state, dispatch] = useReducer(reducer, {displayedRecords: [], shelvedRecords: {}, shelves: {}});

  const onDragEnd = useCallback(
    result => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        dispatch({
          type: 'reorderInShelf',
          shelfId: source.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      } else {
        dispatch({
          type: 'moveBetweenShelves',
          oldShelf: source.droppableId,
          newShelf: destination.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        });
      }
    },
    [dispatch],
  );

  const fetchRecords = (page) => {
    setRecordPage(page);
  }

  useEffect(() => {
      fetch(
        `https://api.discogs.com/users/blacklight/collection/folders/0/releases?page=${recordPage}&per_page=10`,
      )
        .then(resp => resp.json())
        .then(json => {
          const currentRecords = json.releases.map(release => {
              const { id, basic_information: info } = release;
              return {
                id: `${id}`,
                title: info.title,
                formats: info.formats.map(format => format.name),
                label: info.labels?.[0]?.name ?? '',
                artists: info.artists.map(artist => artist.name),
                date: info.year,
              };
            });
          dispatch({
            type: 'updateDisplayedRecords',
            displayedRecords: currentRecords,
          })
          setTotalRecordPages(json.pagination.pages)
        });
    }, [recordPage]);

  return (
    <Container>
      <h1>Record Shelves App</h1>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <RecordsContainer
            recordPages={totalRecordPages}
            fetchRecords={fetchRecords}
            state={state}
            dispatch={dispatch}
          />
        </Grid>

        <Grid item xs={9}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Shelves state={state} dispatch={dispatch} />
          </DragDropContext>
        </Grid>
      </Grid>
    </Container>
  );
}
