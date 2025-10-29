import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Navbar, Nav } from 'rsuite';
import { Link } from 'react-router-dom';
import { routes } from './routes/routes';
import './App.css';

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  return (
    <Router>
      <div>
        <Navbar appearance="inverse">
          <Navbar.Brand>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Invoice Web</Link>
          </Navbar.Brand>
          <Nav>
            <Nav.Item as={Link} to="/">Home</Nav.Item>
            <Nav.Item as={Link} to="/about">About</Nav.Item>
            <Nav.Item as={Link} to="/contact">Contact</Nav.Item>
          </Nav>
        </Navbar>
        <div style={{ marginTop: '56px' }}>
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
