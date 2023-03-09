import { useState, useEffect, React } from 'react'
import { Alert, FormRow, Logo } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'

// Initial states for the fields

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
    showAlert: false
}

function Register() {
    const [values, setValues] = useState(initialState)

    // global states and useNavigate
    const {isLoading, showAlert, displayAlert} = useAppContext();

    // Toggles the state between login and register (changes isMember)
    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    // Fires every time a change happens in any field
    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    // Handles the submit action
    const handleSubmit = (e) => {
        e.preventDefault();
        const {name, email, password, isMember } = values;

        if(!email || !password || (!isMember && !name)){
            displayAlert();
            return
        }
        console.log(values);
    }

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
                <button type='submit' className='btn btn-block' onClick={handleSubmit}>
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