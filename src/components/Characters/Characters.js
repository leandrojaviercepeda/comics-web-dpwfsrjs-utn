import React, {useState} from 'react'
import CharsList from './CharsList'
import CharsSearcher from './CharsSearcher'
import CharsSelector from './CharsSelector'

export default function Characters() {
    const [listSelected, setListSelected] = useState('all')    
    const [charSearched, setCharSearched] = useState('')

    return (
        <div>
            <div className='p-grid p-justify-center m5'>
                <CharsSearcher 
                    onSearch={setCharSearched}
                />
                <CharsSelector 
                    onSelect={setListSelected}
                />
            </div>
            <CharsList 
                listSelected={listSelected} 
                charSearched={charSearched}
            />
        </div>
    )
}
