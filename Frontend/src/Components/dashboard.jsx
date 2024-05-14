import React from "react";

function App() {
  return (
    <div className="app">
      <header>
        <nav>
          <div className="logo">EDUGAINER</div>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Library</a>
            </li>
            <li>
              <a href="#">Classes</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
          <div className="auth-buttons">
            <button className="login">Login</button>
            <button className="register">Register</button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Welcome to EduGainer's Library & Classes</h1>
          <p>Empowering Education Through Innovation</p>
          <div className="buttons">
            <button className="explore">Explore Our Offerings</button>
            <a href="#" className="learn-more">
              Learn More →
            </a>
          </div>
        </section>
      </main>

      <footer>{/* Footer content */}</footer>
    </div>
  );
}

export default App;
