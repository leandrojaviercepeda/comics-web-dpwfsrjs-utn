import React, {useState, useEffect} from 'react'
import MovieSearcher from '../../Movie/MovieSearcher'
import {Panel} from 'primereact/panel'
import {Message} from 'primereact/message'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import {Carousel} from 'react-responsive-carousel'
import axios from 'axios'
import {API_COMICS} from '../../../utils/constants'
import {API_MOVIE_DB} from '../../../utils/constants'
import {API_MOVIE_DB_IMG} from '../../../utils/constants'
import {APIKEY_MOVIE_DB} from '../../../utils/constants'
import {HandleImgError} from '../../../utils/functions'
import {getMovieCharacters} from '../functions'

export default function NewMovie() {
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [movie, setMovie] = useState(undefined)
    const [knownMovieChars, setKnownMovieChars] = useState([])
    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    useEffect(() => {
        try {
            if (movie && movie.id) {
                Promise.all([
                    axios.get(`${API_COMICS}/character`),
                    axios.get(`${API_MOVIE_DB}/movie/${movie.id}/credits?api_key=${APIKEY_MOVIE_DB}`),
                ])
                .then((responses) => {
                    if (responses[0]?.data && responses[1]?.data?.cast) {
                        setKnownMovieChars(getMovieCharacters(responses[0]?.data, responses[1]?.data?.cast))
                    }
                })
                .catch((error) => {
                    console.error(error)
                    handleStatus(true, 'error' ,'Ocurrio un error al obtener creditos de la pelicula :(')
                })
            }
        } catch (error) {
            handleStatus(true, 'error' ,'¡Ooops, ha ocurrido un error!')
        }
    }, [movie]);

    const onSave = () => {
        try {
            if (!movie) return handleStatus(true, 'warn', 'Debe seleccionar una pelicula! :)')
            const promises = []
            if (Array.isArray(knownMovieChars) && knownMovieChars.length > 0) {
                for (const char of knownMovieChars) {
                    promises.push(axios.put(`${API_COMICS}/character/${char?.id_charact}`, {...char, movies: [...char.movies, movie.title]}))
                }
            }
            promises.push(axios.post(`${API_COMICS}/movie`, movie))
            
            Promise.all(promises)
            .then(() => {
                handleStatus(true, 'success', '¡Pelicula guardada exitosamente! :)')
                setInterval(() => {
                    handleStatus(false)
                    refreshPage()
                }, 2000)
            })
            .catch(() => {
                handleStatus(true, 'error', 'Ocurrio un error al guardar pelicula :(')
            })
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }

    const refreshPage = () => window.location.reload(true)

    return (
        <div className="newMovie">

            <div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>
            {
                <div className='p-grid p-justify-around' style={{gap: '1em'}}>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {/* Carousel of images */}
                        <Carousel 
                            showArrows={true}
                            showThumbs={false}
                            showIndicators={false}
                            showStatus={false}
                        >
                        
                        {
                            movie
                            ?
                                <img 
                                    src={`${API_MOVIE_DB_IMG}${movie.poster_path}`}
                                    key="1"
                                    alt="img-1"
                                    onError={e => HandleImgError(e)}
                                    style={{
                                        background: 'white', 
                                        objectFit: 'contain',
                                        objectPosition: 'center center',
                                        height: '100%',
                                        maxHeight: '75vh',
                                    }}
                                />
                            :
                                <img 
                                    src={`/images/Logos/Cinema.png`} 
                                    key="1"
                                    alt="img-1"
                                    onError={e => HandleImgError(e)}
                                    style={{
                                        background: 'white', 
                                        objectFit: 'contain',
                                        objectPosition: 'center center',
                                        height: '100%',
                                        maxHeight: '75vh',
                                    }}
                                />
                        }
                        </Carousel>
                    </div>
                
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Panel header={'Buscador de peliculas'} style={{textAlign: 'center'}}>
                            <MovieSearcher 
                                onSave={onSave}
                                onSelect={setMovie}
                            />
                        </Panel>
                    </div>
                </div>
            }
        </div>
    )
}