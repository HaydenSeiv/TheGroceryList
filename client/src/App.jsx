import { Container, Stack } from '@chakra-ui/react'
import Navbar from './components/Navbar';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

// eslint-disable-next-line react-refresh/only-export-components
export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000/api" : "/api";
function App() {

  return (
    <Stack h="100vh">
      <Navbar />
        <Container>
          <ItemForm />
          <ItemList />
        </Container>
    </Stack>
  );
}

export default App