import React from "react";
import { Link } from "react-router-dom";
// Import your CSS file for styling

// ButtonLink Component
function ButtonLink({ to, children }) {
  return (
    <Link to={to}>
      <button>{children}</button>
    </Link>
  );
}

// App Component
function Library() {
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
              <Link to="/library">Library</Link>
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
            <ButtonLink to="/login" className="button">
              Login
            </ButtonLink>
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

        {/* Cards Section */}
        <section className="shift-cards">
          <h2>Library Shifts</h2>
          <div className="card-container">
            {/* Card 1 */}
            <div className="card">
              <h3>Morning Shift</h3>
              <p>20 seats available</p>
              <ButtonLink to="/new-reg">
                Registration
              </ButtonLink>
            </div>
            {/* Card 2 */}
            <div className="card">
              <h3>Afternoon Shift</h3>
              <p>15 seats available</p>
            </div>
            {/* Card 3 */}
            <div className="card">
              <h3>Evening Shift</h3>
              <p>10 seats available</p>
            </div>
            {/* Card 4 */}
            <div className="card">
              <h3>Night Shift</h3>
              <p>18 seats available</p>
            </div>
            {/* Card 5 */}
            <div className="card">
              <h3>Weekend Shift</h3>
              <p>25 seats available</p>
            </div>
            {/* Card 6 */}
            <div className="card">
              <h3>24/7 Shift</h3>
              <p>5 seats available</p>
            </div>
          </div>
        </section>
      </main>

      <footer>{/* Footer content */}</footer>
    </div>
  );
}

export default Library;
