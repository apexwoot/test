import { createContainer, createHook, createSelector, createStore, createSubscriber } from 'react-sweet-state';

import axios from 'axios';


const initialState = {
  data: [],
  isLoading: false,
  activeEntityRetrieveConfig: null,
  error: null
};

const BooksStore = createStore({
  name: 'books',
  initialState,
  actions: {}
});

export const BooksContainer = createContainer(
  BooksStore,
  {
    onInit:  () => async ({dispatch, getState, setState }) => {
      const state = getState();
      if ((state.data.length === 0) && !state.isLoading && state.error === null) {
        setState({ isLoading: true });
        const { data } = await axios.get('http://localhost:8097/api/books')
        setState({ isLoading: false, data });
      }

    },
    displayName: 'books-container'
  }
);


export const useBooksIsLoading = createHook(BooksStore, {
  selector: state => state.isLoading,
});

const getSortedBooks = createSelector(
  state => state.data,
  (data) => [...data].sort((prevBook, nextBook) => prevBook.author.localeCompare(nextBook.author) ||
    prevBook.title.localeCompare(nextBook.title))
);

export const useBooksStore = createHook(BooksStore, {
  selector: state => state,
});

export const useBooks = createHook(BooksStore, {
  selector: getSortedBooks,
});

export const useBooksActiveEntityRetrieveConfig = createHook(BooksStore, {
  selector: state => state.activeEntityRetrieveConfig,
});

export const useBookById = createHook(BooksStore, {
  selector: ({ data }, props) => {
    const { id } = props || {};
    if (!(id) || data.length === 0) return undefined;

    return data.find(book => book.id === id) || null;
  },
});

export const useBookViewDtoById = createHook(BooksStore, {
  selector: (state, props) => {
    const { id } = props || {};
    if (!(id) || state.data.length === 0) return undefined;

    const bookFound = state.data.find(book => book.id === id);

    return (bookFound) ? { ...bookFound } : null;
  },
});

export const useBooksError = createHook(BooksStore, {
  selector: state => state.error,
});

export const useActiveBook = createHook(BooksStore, {
  selector: state => state.activeBook,
});

export const useBooksActions = createHook(BooksStore, {
  selector: null,
});

const getBooksWithEditFieldAndNotLost = createSelector(
  state => state.data,
  (_, props) => props,
  (data, { isLost = false }) => {
    const editBooks = data.map(book => ({ ...book, edit: book.id }));
    const lostBooks = editBooks.filter(book => book.count !== book.lostCount);
    return isLost ? editBooks : lostBooks;
  }
);

export const useFinalBooks = createHook(BooksStore, {
  selector: getBooksWithEditFieldAndNotLost
});



export const BooksSubscriber = createSubscriber(BooksStore)