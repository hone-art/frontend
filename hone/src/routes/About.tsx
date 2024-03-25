import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";
import "../styles/about.css"

const About = () => {
  const { isLoggedIn, autoLogin } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) autoLogin();
  }, [])

  return (
    <>
      {isLoggedIn ? < LoggedInHeader /> : <LoggedOutHeader />}
      <section className="about-container">
        <h1 className="about-title">Meet Our Team</h1>
        <div className="team-members-container">
          <div className="team-member-container">
            <img src="jiaxian_pfp.png" alt="Jiaxian Gu pfp" className="about-pfp" />
            <div className="member-description">
              <h2 className="about-name">Jiaxian Gu</h2>
              <p className="member-role">Full Stack Engineer</p>
              <p><strong>Interests:</strong></p>
              <ul className="about-ul">
                <li>Photography</li>
                <li>Skiing</li>
              </ul>
              <div className="social-media">
                <a href="https://github.com/JiaxianGu"><img src="/github_icon.png" alt="github icon" className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/jiaxian-gu/"><img src="/linkedin_icon.png" alt="linkedin icon" className="social-icon" /></a>
              </div>
            </div>
          </div>
          <div className="team-member-container">
            <img src="/yurika_pfp.jpg" alt="Yurika Hirata pfp" className="about-pfp" />
            <div className="member-description">
              <h2 className="about-name">Yurika Hirata</h2>
              <p className="member-role">Tech Lead</p>
              <p><strong>Interests:</strong></p>
              <ul className="about-ul">
                <li>Collage</li>
                <li>Rhythm games</li>
              </ul>
              <div className="social-media">
                <a href="https://github.com/yurikahirata"><img src="/github_icon.png" alt="github icon" className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/yurika-hirata/"><img src="/linkedin_icon.png" alt="linkedin icon" className="social-icon" /></a>
              </div>
            </div>
          </div>
          <div className="team-member-container">
            <img src="kiarosh_pfp.jpg" alt="Kiarosh Moeini pfp" className="about-pfp" />
            <div className="member-description">
              <h2 className="about-name">Kiarosh Moeini</h2>
              <p className="member-role">Product Owner</p>
              <p><strong>Interests:</strong></p>
              <ul className="about-ul">
                <li>Drawing</li>
                <li>Hiking</li>
              </ul>
              <div className="social-media">
                <a href="https://github.com/kiaroshmoeini"><img src="/github_icon.png" alt="github icon" className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/kiarosh-moeini/"><img src="/linkedin_icon.png" alt="linkedin icon" className="social-icon" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default About;