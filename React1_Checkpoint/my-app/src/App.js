import React from 'react';
import { Container, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';
import './App.css';

const cards = [
  {
    icon: '⚛️',
    iconClass: 'icon-red',
    title: 'React Components',
    text: 'Build reusable UI components with React. Each component manages its own state and renders independently.',
  },
  {
    icon: '🎨',
    iconClass: 'icon-blue',
    title: 'Bootstrap Styling',
    text: 'Use React-Bootstrap to build responsive, mobile-first layouts with a modern and clean design system.',
  },
  {
    icon: '🚀',
    iconClass: 'icon-purple',
    title: 'Fast & Scalable',
    text: 'Create React App gives you a fast development environment with hot reload and production-ready builds.',
  },
];

const stats = [
  { number: '10K+', label: 'Users' },
  { number: '50+', label: 'Components' },
  { number: '99%', label: 'Satisfaction' },
  { number: '24/7', label: 'Support' },
];

function App() {
  return (
    <div className="App">
      {/* ===== NAVBAR ===== */}
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Brand className="navbar-brand-text">ReactApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto">
              <Nav.Link className="custom-nav-link" href="#">Home</Nav.Link>
              <Nav.Link className="custom-nav-link" href="#">About</Nav.Link>
              <Nav.Link className="custom-nav-link" href="#">Projects</Nav.Link>
              <Nav.Link className="custom-nav-link" href="#">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        <Container>
          <h1 className="hero-title">Welcome to ReactApp</h1>
          <p className="hero-subtitle">
            A modern React application built with React-Bootstrap.
            Clean, responsive, and ready to scale.
          </p>
          <button className="hero-btn">Get Started</button>
        </Container>
      </section>

      {/* ===== FEATURES ===== */}
      <Container className="py-5">
        <h2 className="section-title">Features</h2>
        <div className="section-divider" />

        <Row className="g-4">
          {cards.map((card, index) => (
            <Col md={4} key={index}>
              <Card className="feature-card">
                <Card.Body>
                  <div className={`card-icon-wrap ${card.iconClass}`}>
                    {card.icon}
                  </div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col md={3} xs={6} key={index} className="stat-item mb-3">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="custom-footer">
        <p>© 2025 <span>ReactApp</span> — Built with React & Bootstrap</p>
      </footer>
    </div>
  );
}

export default App;
