import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; 
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LoginForm = () => {
    // Context
    const { loginUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    const {username, password} = loginForm;

    const onChangeLoginForm = event => setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

    const login = async (event) => {
        event.preventDefault();

        try {
            const loginData = await loginUser(loginForm);
            console.log('loginData:', loginData)
            if (loginData.success) {
                navigate('/newfeed');
            } else {
                navigate('/register');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Form className='my-4' onSubmit={login}>
                <Form.Group className='mb-2'>
                    <Form.Control type="text" name="username" placeholder="Username" value={username} onChange={onChangeLoginForm} required />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" name="password" placeholder="Password" value={password} onChange={onChangeLoginForm} required />
                </Form.Group>
                <Button variant="success" type="submit" className='mt-3'>Login</Button> {/* Fixed typo in variant */}
            </Form>
            <p>
                Don't have an account? <Link to="/register">
                    <Button variant="info" size='sm' className='ml-2'>Register</Button>
                </Link>
            </p>
        </>
    )
}

export default LoginForm;