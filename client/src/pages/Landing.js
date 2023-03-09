import React from 'react'
import main_ from '../assets/images/main.svg'
// import styled from 'styled-components'
import { Logo } from '../components'
import { Link } from 'react-router-dom'

import Wrapper from '../assets/wrappers/LandingPage'

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            Job <span>Tacking</span> App
          </h1>
          <p>
            A Job Searching Web App is a platform designed to help job seekers find job opportunities and apply for them. The app typically allows users to create a profile, upload their resume, and search for job listings based on various criteria such as location, industry, and job title. The job listings will usually include detailed information about the role, the company, and the requirements for the job, as well as the option to apply directly through the app. Some Job Searching Web Apps may also offer features such as resume building tools, salary comparisons, and personalized job recommendations based on the user's job search history. The goal of the app is to simplify the job search process and help users find their next opportunity more efficiently.
          </p>
          <Link to='/register'>
            <button className='btn btn-hero'>Login/Register</button>
          </Link>
        </div>
        <img src={main_} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  )
}

// const Wrapper = styled.main`
//   nav{
//     width: var(--fluid-width);
//     max-width: var(--max-width);
//     margin: 0 auto;
//     height: var(--nav-height);
//     display: flex;
//     align-items: center;
//   }

//   .page{
//     min-height: calc(100vh - var(--nav-height));
//     display: grid;
//     align-items: center;
//     //margin-top: -3rem;
//   }
//   h1{
//     font-weight: 700;
//     span{
//       color: var(--primary-500);
//     }
//   }
//   p{
//     color: var(--grey-600);
//   }
//   .main-img{
//     display: none;
//   }
//   @media (min-width: 992px){
//     .page{
//       grid-template-columns: 1fr 1fr;
//       column-gap: 3rem;
//     }
//     .main-img{
//       display: block;
//     }
//   }
// `


export default Landing