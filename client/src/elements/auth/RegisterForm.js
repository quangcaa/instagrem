import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:1000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);
            navigate('/newfeed');
        } else {
            console.log('Registration failed:', response.status);
            // handle failed registration
        }
    };

    return (
        <>
            <Form className='my-4' onSubmit={handleRegistration}>
                <Form.Group className='mb-2'>
                    <Form.Control type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>
                <Form.Group className='mb-2'>
                    <Form.Control type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button variant="success" type="submit" className='mt-3'>Register</Button>
            </Form>
            <p>
                Already have an account? <Link to="/Login">
                    <Button variant="info" size='sm' className='ml-2'>Login</Button>
                </Link>
            </p>
        </>
    );
};

export default RegistrationForm;