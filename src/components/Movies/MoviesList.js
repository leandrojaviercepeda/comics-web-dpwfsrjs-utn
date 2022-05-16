import React, {useState, useEffect, useRef} from 'react';
import {Message} from 'primereact/message';
import MovieCard from '../Movie/MovieCard'
import {ProgressSpinner} from 'primereact/progressspinner';
import axios from 'axios'
import {API_COMICS} from '../../utils/constants'

export default function MoviesList(props) {
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [movies, setMovies] = useState([])
    const loaded = useRef(false)
    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    useEffect(() => {
        try {
            if (loaded.current) return
            loaded.current = true
            axios.get(`${API_COMICS}/movie`)
            .then((response => {
                setMovies(response.data)
            }))
            .catch((error) => {
                console.error(error)
                handleStatus(true, 'error', 'Ocurrio un error al obtener datos :(')
            })
        } catch (error) {
            console.error(error)
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }, []);

    const getMovies = searched => {
        if (!Array.isArray(movies)) return []
        let items = [...movies]
        if (searched && searched !== '')
            return items.filter(item => item.title.toLowerCase().includes(searched.toLowerCase()))
        return items
    }

    return (
        <div className="charsList">
            <div className="p-grid p-justify-center m5">
                {
                    status.showMessage 
                    ? <Message severity={status.type} text={status.message}/>
                    : null
                }
            </div>
            <div className="p-grid p-justify-center">
                {
                    movies.length !== 0
                    ? getMovies(props.movieSearched).map((movie, i) => (
                        <div className="box" key={i}>
                            <MovieCard movie={movie}/>
                        </div>
                    ))
                    : <ProgressSpinner 
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                }
            </div>
        </div>
    )
}