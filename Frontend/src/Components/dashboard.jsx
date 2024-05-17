import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../App";
import { logoutUser } from "../services/auth"; // Adjust the path as per your file structure

function Dashboard() {
  const navigate = useNavigate();
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function
      setIsUserLoggedIn(false); // Update context to reflect logged out state
      navigate("/login"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
              <a href="">Classes</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
          <div className="auth-buttons">
            {IsUserLoggedIn ? (
              <button onClick={handleLogout} className="button">
                Logout
              </button>
            ) : (
              <Link to="/login" className="button">
                Login
              </Link>
            )}
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

export default Dashboard;
