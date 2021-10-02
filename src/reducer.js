let shelfIdCounter = 0;

export const reducer = (state, action) => {
  switch (action.type) {
    case 'updateDisplayedRecords': 
      return {
        ...state,
        displayedRecords: action.displayedRecords
      }   
    case 'updateShelvedRecords':
      return {
        ...state,
        shelvedRecords: {
          ...state.shelvedRecords,
          [action.shelvedRecord.id]: action.shelvedRecord
        },
      };
    case 'createShelf':
      const id = `shelf-${shelfIdCounter}`;
      shelfIdCounter++;
      return {
        ...state,
        shelves: {
          ...state.shelves,
          [id]: {
            id,
            name: action.name,
            records: [],
          },
        }
      };
    case 'deleteShelf':
      return {
        ...state,
        shelves: Object.entries(state.shelves).reduce((newShelvesState, [id, value]) => {
          if (id !== action.id) {
            newShelvesState[id] = value;
          }
          return newShelvesState;
        }, {})
      };
    case 'renameShelf':
      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.id]: {
            ...state[action.id],
            name: action.name,
          },
        }
      };
    case 'addRecordToShelf':
      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.shelfId]: {
            ...state.shelves[action.shelfId],
            records: state.shelves[action.shelfId].records.includes(action.recordId) ? state.shelves[action.shelfId].records : state.shelves[action.shelfId].records.concat(action.recordId),
          },
        }
      };
    case 'removeRecordFromShelf':
      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.shelfId]: {
            ...state.shelves[action.shelfId],
            records: state.shelves[action.shelfId].records.filter(
              id => id !== action.recordId,
            ),
          },
        }
      };
    case 'reorderInShelf':
      const newOrder = [...state.shelves[action.shelfId].records];
      const [record] = newOrder.splice(action.oldIndex, 1);
      newOrder.splice(action.newIndex, 0, record);
      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.shelfId]: {
            ...state.shelves[action.shelfId],
            records: newOrder,
          },
        }
      };
    case 'moveBetweenShelves':
      const newShelf = [...state[action.newShelf].records];
      newShelf.splice(
        action.newIndex,
        0,
        state.shelves[action.oldShelf].records[action.oldIndex],
      );

      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.oldShelf]: {
            ...state.shelves[action.oldShelf],
            records: state.shelves[action.oldShelf].records.filter(
              (record, index) => index !== action.oldIndex,
            ),
          },
          [action.newShelf]: {
            ...state.shelves[action.newShelf],
            records: newShelf,
          },
        }
      };
    default:
      throw new Error();
  }
};
