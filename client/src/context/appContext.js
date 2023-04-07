import React, { useReducer, useContext } from 'react'
import reducer from './reducer';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  UPDATE_USER_AUTH_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE
} from "./actions";
import axios from 'axios'

// getting and setting initial states..

const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  showSidebar: false,
  iSEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchJobType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const AppContext = React.createContext();

const AppProvider = ({ children }) => {



  //reducer: function that will handle the dispatch

  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios - Global Approach

  // axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`




  // Axios - Custom Instance
  // const authFetch = axios.create({
  //   baseURL: '/api/v1',
  //   headers: {
  //     Authorization: `Bearer ${state.token}`
  //   }
  // })


  // Using Axios Interceptors
  // main purpose of using them was to distinguish between 400 (Bad Request) and 401 (Authorization) errors.

  const authFetch = axios.create({
    baseURL: '/api/v1',
  })
  // Request
  authFetch.interceptors.request.use(
    (config) => {
      // config.headers.common['Authorization'] = `Bearer ${state.token}`
      // Above was not working, using alternative approach from StackOverFlow.
      config.headers['Authorization'] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // Response
  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        dispatch({ type: UPDATE_USER_AUTH_ERROR });
        clearAlert()
        setTimeout(() => {
          logoutUser()
        }, 3000);
      }
      return Promise.reject(error)
    }
  )


  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000)
  }


  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('location')
  }

  // const registerUser = async (currentUser) => {
  //   dispatch({ type: REGISTER_USER_BEGIN })
  //   try {
  //     const response = await axios.post('/api/v1/auth/register', currentUser);
  //     const { user, token, location } = response.data
  //     dispatch({
  //       type: REGISTER_USER_SUCCESS,
  //       payload: { user, token, location }
  //     })

  //     // saving to local storage
  //     addUserToLocalStorage({ user, token, location })
  //   } catch (error) {
  //     // console.log(error);
  //     dispatch({
  //       type: REGISTER_USER_ERROR,
  //       payload: { msg: error.response.data.msg }
  //     })
  //   }
  //   // in both cases, i.e upon success and error, we will clear the and hide/close the alert.
  //   clearAlert()
  // }

  // Handles both Login and Register Functionality...

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN })
    try {
      const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);
      const { user, token, location } = data
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText }
      })

      // saving to local storage
      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      // console.log(error);
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    // in both cases, i.e upon success and error, we will clear the and hide/close the alert.
    clearAlert()
  }

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  }

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage()
  }


  const updateUser = async (currentUser) => {

    dispatch({ type: UPDATE_USER_BEGIN });

    try {
      // Axios - Manual Approach

      // const { data } = await axios.patch('/api/v1/auth/updateUser', currentUser, {
      //   headers: {
      //     Authorization: `Bearer ${state.token}`
      //   }
      // })

      // Axios - by using Global Approach
      // const { data } = await axios.patch('/api/v1/auth/updateUser', currentUser)

      // One Major issue/downside with this approach is that, this will cause the bearer token to be send to any other requests too. consider following
      // const { data: tours } = await axios.get('https://course-api.com/react-tours-project')
      // console.log(tours)
      // hence good way would be to use Custom Instances in Axios.

      // Axios - by Using Custom Instance
      const { data } = await authFetch.patch('/auth/updateUser', currentUser) // since /api/v1 was the base so we will exclude it.

      const { user, token, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, location }
      })

      addUserToLocalStorage({ user, token, location })

    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg }
        })
      }
    }

    clearAlert();

  }

  const handleChange = async ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value }
    })
  }

  const clearValues = async () => {
    dispatch({ type: CLEAR_VALUES })
  }


  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {

      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.post('/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status
      })

      dispatch({ type: CREATE_JOB_SUCCESS })

      // clearing fields
      dispatch({ type: CLEAR_VALUES })

    } catch (error) {
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert()
  }

  const getJobs = async () => {
    const { page, search, searchStatus, searchJobType, sort } = state

    let url = `/jobs?page=${page}&status=${searchStatus}&searchJobType=${searchJobType}&sort=${sort}`

    if (search) {
      url = url + `&search=${search}`
    }

    dispatch({ type: GET_JOBS_BEGIN });

    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data

      console.log({ jobs, totalJobs, numOfPages })

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages
        }
      })

    } catch (error) {
      console.log(error.response)
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  }

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const { position, company, jobType, jobLocation, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        position,
        company,
        jobType,
        jobLocation,
        status
      })
      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.statud === 401) {
        return
      }
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
      clearAlert();
    }
  }

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      logoutUser()
    }
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        }
      })
    } catch (error) {
      // console.log(error.response)
      logoutUser()
    }
    clearAlert()
  }

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  const changePage = (page) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: { page }
    })
  }


  return <AppContext.Provider value={{
    ...state,
    displayAlert,
    setupUser,
    toggleSidebar,
    logoutUser,
    updateUser,
    handleChange,
    clearValues,
    createJob,
    getJobs,
    setEditJob,
    editJob,
    deleteJob,
    showStats,
    clearFilters,
    changePage
  }}>
    {/* children is the entire application */}
    {children}
  </AppContext.Provider>
}

/*
making/setting up hook, because if we don't use it like that
then we have to import useContext to get that AppContext and only
then we can have access to whatever we have in value prop.
so we will create a custom hook to avoid importing useContext in every
Component
*/

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }