import React, {useReducer, useContext, Component} from 'react'
import reducer from './reducer';
import { DISPLAY_ALERT, CLEAR_ALERT } from "./actions";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: ''
}

const AppContext = React.createContext();

const AppProvider = ({children}) => {

  //reducer: function that will handle the dispatch

  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({type: DISPLAY_ALERT});
    clearAlert();
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({type: CLEAR_ALERT});
    }, 3000)
  }

  return <AppContext.Provider value={{...state, displayAlert}}>
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

export {AppProvider, initialState, useAppContext}