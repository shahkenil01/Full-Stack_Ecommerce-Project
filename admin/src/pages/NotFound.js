import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound-page" style={{
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'}}>
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '30px 40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'}}>
        <h2 style={{
          marginBottom: '15px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#24292f'}}>
          Page not found
        </h2>
        <p style={{
          color: '#57606a',
          fontSize: '14px',
          marginBottom: '20px'}}>
          Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
        </p>
        <Link to="/" style={{
          marginTop: '10px',
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#0d6efd',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '14px'}}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;