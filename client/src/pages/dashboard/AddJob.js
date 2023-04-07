import React from 'react'
import { FormRow, Alert, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

function AddJob() {

    const {
        isLoading,
        showAlert,
        displayAlert,
        isEditing,
        position,
        company,
        jobLocation,
        jobTypeOptions,
        jobType,
        statusOptions,
        status,
        handleChange,
        clearValues,
        createJob,
        editJob
    } = useAppContext();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!position || !company || !jobLocation) {
            displayAlert()
            return
        }
        if (isEditing) {
            editJob()
            return
        }

        createJob()
    }

    const handleJobInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        handleChange({ name, value })
    }


    return (
        <Wrapper>
            <form className='form'>
                <h3>{isEditing ? 'edit job' : 'add job'}</h3>
                {showAlert && <Alert />}

                {/* Position */}
                <div className='form-center'>
                    <FormRow
                        type='text'
                        name='position'
                        value={position}
                        handleChange={handleJobInput}
                    />

                    {/* Company */}
                    <FormRow
                        type='text'
                        name='company'
                        value={company}
                        handleChange={handleJobInput}
                    />

                    {/* Location */}
                    <FormRow
                        type='text'
                        name='jobLocation'
                        labelText='Job Location'
                        value={jobLocation}
                        handleChange={handleJobInput}
                    />

                    {/* Job Status */}
                    <FormRowSelect
                        name='status'
                        value={status}
                        handleChange={handleJobInput}
                        list={statusOptions}
                    />


                    {/* job type */}
                    <FormRowSelect
                        name='jobType'
                        value={jobType}
                        labelText='type'
                        handleChange={handleJobInput}
                        list={jobTypeOptions}
                    />

                    {/* btn container */}
                    <div className='btn-container'>
                        <button
                            className='btn btn-block submit-btn'
                            type='submit'
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            submit
                        </button>

                        <button
                            className='btn btn-block clear-btn'
                            type='submit'
                            onClick={(e) => {
                                e.preventDefault();
                                clearValues();
                            }}
                        >
                            clear
                        </button>
                    </div>

                </div>

            </form>
        </Wrapper>
    )
}

export default AddJob