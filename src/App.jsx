import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import HomeUi from "./components/home/Home";
import ChatUI from "./components/home/ChatUI";
import BF from "./components/ai/BF";
import DG from "./components/ai/DG";
ChatUI

function Home() {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const { offsetTop, offsetHeight } = section;

      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        const scrollbarColor = section.getAttribute("data-scrollbar-color");
        const backgroundColor = section.getAttribute("data-background-color");

        document.documentElement.style.setProperty(
          "--scrollbar-thumb",
          scrollbarColor
        );
        document.documentElement.style.setProperty(
          "--background-color",
          backgroundColor
        );
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">

      <NavBar />
      <section
        id="hero"
        data-scrollbar-color="#0069fb"
        data-background-color="rgba(0, 0, 0, 0)"
        className="min-h-screen"
      >
        <Hero />
      </section>
      <section
        id="about"
        data-scrollbar-color="#ff0000"
        data-background-color="rgba(0, 0, 0, 0)"
        className="min-h-screen"
      >
        <About />
      </section>
      <section
        id="features"
        data-scrollbar-color="#00ff00"
        data-background-color="#000"
        className="min-h-screen"
      >
        <Features />
      </section>
      <section
        id="story"
        data-scrollbar-color="#ff00ff"
        data-background-color="#fbeffb"
        className="min-h-screen"
      >
        <Story />
      </section>
      <section
        id="contact"
        data-scrollbar-color="#0000ff"
        data-background-color="#e6f0ff"
        className="min-h-screen"
      >
        <Contact />
      </section>
      <Footer />
    </main>
  );
}


function Auth() {

  const navigate = useNavigate(); // For navigation

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User Info:", user);
      alert(`Welcome, ${user.displayName}`);
      navigate("/home"); // Redirect to home page after login
    } catch (error) {
      console.error("Error during login:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  return<div style={styles.container}>
    <center>
   <button onClick={handleGoogleLogin} style={styles.button}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          style={styles.icon}
        />
        Continue with Google
      </button>
      </center>
</div>;
}
const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  icon: {
    width: "20px",
    marginRight: "10px",
  },
};

function Chat() {

  return <>
  <HomeUi/>  
  </>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/girlfriend-ai" element={<ChatUI />} />
        <Route path="/friend-ai" element={<BF />} />
        <Route path="/doppelganger-ai" element={<DG />} />
      </Routes>
    </Router>
  );
}

export default App;
