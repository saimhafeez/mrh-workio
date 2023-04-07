import { useState, React } from 'react'
import { Alert, FormRow, Logo } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Initial states for the fields

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
    // showAlert: false
}

function Register() {
    const [values, setValues] = useState(initialState)
    const navigate = useNavigate();

    // global states and useNavigate
    const { user, isLoading, showAlert, displayAlert, setupUser } = useAppContext();

    // Toggles the state between login and register (changes isMember)
    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    // Fires every time a change happens in any field
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    // Handles the submit action
    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, isMember } = values;

        if (!email || !password || (!isMember && !name)) {
            displayAlert();
            return
        }
        const currentUser = { name, email, password }
        if (isMember) {
            setupUser({
                currentUser,
                endPoint: 'login',
                alertText: 'Login Successful! Rediecting...'
            })
        } else {
            setupUser({
                currentUser,
                endPoint: 'register',
                alertText: 'User Created! Rediecting...'
            })
        }

    }

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
    }, [user, navigate])

    return (
        <Wrapper className='full-page'>
            <form className='form' onSubmit={onsubmit}>
                <Logo />
                <h3>{values.isMember ? 'Login' : 'Register'}</h3>
                {showAlert && <Alert />}

                {/* name input */}
                {
                    !values.isMember && (
                        <FormRow
                            name='name'
                            type='text'
                            value={values.name}
                            handleChange={handleChange}
                        />
                    )}

                {/* email input */}
                <FormRow
                    name='email'
                    type='email'
                    value={values.email}
                    handleChange={handleChange}
                />
                {/* password input */}
                <FormRow
                    name='password'
                    type='password'
                    value={values.password}
                    handleChange={handleChange}
                />
                <button type='submit' className='btn btn-block' onClick={handleSubmit} disabled={isLoading}>
                    submit
                </button>
                <p>
                    {values.isMember ? 'Not a member yet?' : 'Already a member?'}
                    <button type='button' className='member-btn' onClick={toggleMember} >
                        {values.isMember ? 'Register' : 'Login'}
                    </button>
                </p>
            </form>
        </Wrapper>
    )
}

export default Register