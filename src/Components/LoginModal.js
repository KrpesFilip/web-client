import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/global';

function LoginModal({ isOpen, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const { login, user } = useGlobalContext(); // get user

    // Reset fields when modal opens or user logs out
    useEffect(() => {
        if (!user && isOpen) {
            setUsername('');
            setPassword('');
            setError('');
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const url = isRegister 
            ? 'http://localhost:3001/api/register'
            : 'http://localhost:3001/api/login';

        const body = isRegister 
            ? { username, password, role: 'user' } 
            : { username, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                if (!isRegister) login(data.token);  // Update global user state
                onClose(); // close modal
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <button onClick={onClose} style={modalStyles.close}>X</button>
                <h2>{isRegister ? 'Register' : 'Login'}</h2>
                {error && <p style={{color:'red'}}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                </form>
                <p onClick={() => setIsRegister(!isRegister)} style={{cursor:'pointer'}}>
                    {isRegister ? 'Already have an account? Login' : 'No account? Register'}
                </p>
            </div>
        </div>
    );
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top:0,
        left:0,
        width:'100vw',
        height:'100vh',
        backgroundColor:'rgba(0,0,0,0.5)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor:'#fff',
        padding:'2rem',
        borderRadius:'8px',
        width:'300px',
        position:'relative'
    },
    close: {
        position:'absolute',
        top:'10px',
        right:'10px',
        background:'none',
        border:'none',
        fontSize:'1.2rem',
        cursor:'pointer'
    }
};

export default LoginModal;
