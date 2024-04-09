import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; // Import 'Form' directly from 'react-bootstrap'
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    return (
        <>
            <Form className='my-4'>
                <Form.Group className='mb-2'>
                    <Form.Control type="text" placeholder="Username" required />
                </Form.Group>
                <Form.Group className='mb-2'>
                    <Form.Control type="text" placeholder="Email" required />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" placeholder="Password" required />
                </Form.Group>
                <Button variant="success" type="submit" className='mt-3'>Register</Button>
            </Form>
            <p>
                Already have an account? <Link to="/login">
                    <Button variant="info" size='sm' className='ml-2'>Login</Button>
                </Link>
            </p>
        </>
    )
}

export default RegisterForm;