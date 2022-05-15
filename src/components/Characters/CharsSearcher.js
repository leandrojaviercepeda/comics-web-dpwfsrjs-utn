import React from 'react';
import {InputText} from 'primereact/inputtext';
import {capitalize} from '../../utils/functions'

export default function CharsSearcher(props) {
    return (
        <div className="charsSearcher">
            <InputText 
              placeholder="Search" 
              type="text" 
              onChange={e => props.onSearch(capitalize(e.target.value))}
            />
        </div>
    )
}