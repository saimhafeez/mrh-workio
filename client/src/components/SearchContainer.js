import React, { useEffect, useState } from 'react'
import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'

function SearchContainer() {


    const {
        isLoading,
        search,
        searchStatus,
        searchJobType,
        sort,
        sortOptions,
        statusOptions,
        jobTypeOptions,
        handleChange,
        clearFilters
    } = useAppContext();

    const [_search, _setSearch] = useState(search);

    const handleSearch = (e) => {
        if (isLoading) return
        handleChange({ name: e.target.name, value: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearFilters()
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            handleChange({ name: 'search', value: _search })
        }, 2000);
    }, [_search])


    return (
        <Wrapper>
            <form className="form">
                <h4>search form</h4>
                {/* search position */}
                <div className="form-center">
                    <FormRow
                        type='text'
                        name='search'
                        value={_search}
                        handleChange={(e) => {
                            _setSearch(e.target.value)
                            console.log('_search', _search)
                        }}
                    />

                    {/* search by status */}
                    <FormRowSelect
                        labelText='status'
                        name='searchStatus'
                        value={searchStatus}
                        handleChange={handleSearch}
                        list={['all', ...statusOptions]}
                    />

                    {/* search by jobType */}
                    <FormRowSelect
                        labelText='type'
                        name='searchJobType'
                        value={searchJobType}
                        handleChange={handleSearch}
                        list={['all', ...jobTypeOptions]}
                    />

                    {/* sort */}
                    <FormRowSelect
                        name='sort'
                        value={sort}
                        handleChange={handleSearch}
                        list={sortOptions}
                    />

                    <button
                        className="btn btn-block btn-danger"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        clear filters
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default SearchContainer