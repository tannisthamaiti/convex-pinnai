import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)', // Account for navbar and footer
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <img 
          src="/Logo.png"
          alt="Earthscan Logo" 
          style={{ 
            width: '200px',
            height: 'auto'
          }} 
        />
        
        <h1 style={{ margin: 0 }}>Earthscan platform</h1>
        
        <p style={{
          fontSize: '1.5rem',
          margin: 0
        }}>
          Continuous AI for explorers
        </p>
        
        <button
          onClick={() => navigate('/register')}
          style={{
            fontSize: '1.2rem',
            padding: '1rem 2.5rem',
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}