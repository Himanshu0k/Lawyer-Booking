import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo-container">
          <h1 className="logo">JurisHire</h1>
          <p className="tagline">Legal expertise at your fingertips</p>
        </div>
        <nav className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup-user" className="signup-button">Sign Up</Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Find the Right Legal Representation in Minutes</h2>
            <p className="hero-description">
              Connect with experienced attorneys who specialize in your specific legal needs.
              Schedule consultations, manage appointments, and get expert advice—all in one place.
            </p>
            <div className="cta-buttons">
              <Link to="/signup-user" className="primary-button">Get Started</Link>
              <a href="#how-it-works" className="secondary-button">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              {<img src="https://blog.internshala.com/wp-content/uploads/2024/10/lawyer-appointment-letter.png" alt="Image"/>}
              {/* <div className="placeholder-text">Legal consultation illustration</div> */}
            </div>
          </div>
        </section>

        <section className="features-section" id="how-it-works">
          <h2 className="section-title">Why Choose JustHire?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3 className="feature-title">Vetted Professionals</h3>
              <p className="feature-description">
                All lawyers on our platform are thoroughly vetted and have verified credentials and experience.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Perfect Match</h3>
              <p className="feature-description">
                Our smart matching system connects you with attorneys specialized in your specific legal matter.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Easy Scheduling</h3>
              <p className="feature-description">
                Book appointments instantly based on real-time availability. No more phone tag or waiting.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Transparent Pricing</h3>
              <p className="feature-description">
                Clear upfront pricing with no hidden fees. Compare rates and services before booking.
              </p>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <h2 className="section-title">What Our Clients Say</h2>
          
          <div className="testimonials-container">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "JustHire made finding a specialized attorney for my business needs incredibly simple. 
                I was connected with the perfect lawyer within hours."
              </p>
              <p className="testimonial-author">— Michael R., Small Business Owner</p>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "The convenience of scheduling consultations online saved me so much time. 
                My attorney was exactly what I needed for my case."
              </p>
              <p className="testimonial-author">— Sarah T., Real Estate Investor</p>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "As someone who was intimidated by legal processes, JustHire made everything 
                approachable and straightforward. Highly recommend!"
              </p>
              <p className="testimonial-author">— James L., First-time Client</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Legal Partner?</h2>
            <p className="cta-description">
              Join thousands of clients who have successfully found the right legal representation through JustHire.
            </p>
            <Link to="/signup-user" className="cta-button">Sign Up Now</Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>JustHire</h2>
            <p>Legal expertise at your fingertips</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Company</h3>
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
              <a href="#press">Press</a>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#blog">Blog</a>
              <a href="#guides">Legal Guides</a>
              <a href="#faq">FAQ</a>
            </div>
            
            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JustHire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;