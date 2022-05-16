import React, {useState} from 'react';
import {Button} from 'primereact/button';
import {AutoComplete} from 'primereact/autocomplete';
import {Message} from 'primereact/message';
import axios from 'axios'
import {API_MOVIE_DB} from '../../utils/constants'
import {APIKEY_MOVIE_DB} from '../../utils/constants'

export default function MovieSearcher(props) {
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [movies, setMovies] = useState([])
    const [searched, setSearched] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [disabled, setDisabled] = useState(true)

    const handleSelect = (event) => {
        if (!Array.isArray(movies)) return
        const movieSelected = [...movies.filter(movie => movie.title === event.value)]
        props.onSelect(...movies.filter(movie => movie.title === event.value))
        setDisabled(!movieSelected.length >= 1)
    }
    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    const searchMovies = async () => {
        try {
            const moviesFetched = await axios.get(`${API_MOVIE_DB}/search/movie?api_key=${APIKEY_MOVIE_DB}&query=${searched}`)
            const moviesList = moviesFetched.data.results
            setMovies(moviesList)
            setSuggestions(moviesList.map(movie => movie.title))
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }

    const suggestMovies = event => {
        let results;
        if (event.query === '') {
            results = [...movies];
        } if (Array.isArray(suggestions) && suggestions.length > 0) {
            results = suggestions.filter(item => item.toLowerCase().includes(event.query.toLowerCase()));
        }
        setSuggestions(results);
    }

    return (
        <div className="movieSearcher">
            <div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>
            <div className='p-grid p-dir-col p-justify-center'>
                <h3>Ingrese una pelicula</h3>
                    <div>
                        <Button icon="pi pi-search" className="p-button-secondary" onClick={() => searchMovies()}/>
                        <AutoComplete 
                            value={searched}
                            suggestions={Array.isArray(movies) ? movies.map(item => item.title) : []}
                            size={30} 
                            minLength={1}
                            placeholder="Buscar..." 
                            dropdown={true} 
                            onChange={e => setSearched(e.target.value)}
                            completeMethod={e => suggestMovies(e)}
                            onSelect={e => handleSelect(e)}
                            onKeyPress={(e) => e.key === 'Enter' ? searchMovies() : null}
                        />
                    </div>  
                    <div style={{marginTop: '15px'}}>
                        <Button icon="pi pi-save" disabled={disabled} label="Añadir" className="p-button-secondary" onClick={() => props.onSave()}/>
                    </div>
            </div>
        </div>
    )
}