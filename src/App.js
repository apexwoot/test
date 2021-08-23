import './App.css';
import { DataGrid } from '@material-ui/data-grid';
import { BooksContainer, useBooksIsLoading, useBooksStore, useFinalBooks } from './store/books';

const columns = [
  {
    field: 'title',
    headerName: 'title',
    flex: 0.25
  },
  {
    field: 'author',
    headerName: 'author',
    flex: 0.15
  },
  {
    field: 'publisher',
    headerName: 'publisher',
    flex: 0.18
  },
  {
    field: 'language',
    headerName: 'language',
    flex: 0.12
  }
]


function App() {
  const [isLoading] = useBooksIsLoading();
  const [books] = useFinalBooks({isLost: false})
  const [state] = useBooksStore()
  console.log(state);
  return (
    <div style={{ height: 520, width: '100%' }}>
      <BooksContainer isGlobal>
          <DataGrid
            loading={isLoading}
            rows={books}
            columns={columns}
          />
      </BooksContainer>
    </div>
  );
}

export default App;
