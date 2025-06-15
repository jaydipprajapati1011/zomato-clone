import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Zomato Clone</Link>
      <div>
         <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/restaurants" style={styles.link}>Restaurants</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Signup</Link>
      </div>
    </nav>
    
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#ff4757",
    color: "#fff",
  },
  logo: {
    fontWeight: "bold",
    textDecoration: "none",
    color: "#fff",
  },
  link: {
    marginLeft: "15px",
    color: "#fff",
    textDecoration: "none",
  },
};

export default Navbar;
