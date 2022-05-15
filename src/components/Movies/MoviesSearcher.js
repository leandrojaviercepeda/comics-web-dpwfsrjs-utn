import React from 'react';
import {InputText} from 'primereact/inputtext';
import {capitalize} from '../../utils/functions'

export default function MoviesSearcher(props) {
    return (
        <div className="moviesSearcher">
            <InputText 
              placeholder="Search" 
              type="text" 
              onChange={e => props.handleMovieSearched(capitalize(e.target.value))}
            />
        </div>
    )
}