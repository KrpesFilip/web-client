import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimeItem from './Components/AnimeItem';
import Homepage from './Components/Homepage';
import Profile from './Components/Profile';
import ProtectedRoute from './Components/ProtectedRoute'; // import it
import AdminPanel from './Components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/anime/:id" element={<AnimeItem />} />
        
        {/* Protect profile route */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Example: Admin route */}
         <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;
