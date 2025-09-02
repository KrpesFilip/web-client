import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimeItem from './Components/AnimeItem';
import Homepage from './Components/Homepage';
import Profile from './Components/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/anime/:id" element={<AnimeItem />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;