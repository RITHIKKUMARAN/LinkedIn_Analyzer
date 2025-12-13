import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Insights } from './pages/Insights';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/insights/:id" element={<Insights />} />
        <Route path="/insights" element={<Search />} /> {/* Redirect to search if no ID */}
      </Routes>
    </Router>
  );
}

export default App;
