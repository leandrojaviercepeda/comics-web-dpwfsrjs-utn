import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router'
import CharMovieCard from '../Movie/CharMovieCard'
import CharCard from '../Character/CharCard'
import {ProgressSpinner} from 'primereact/progressspinner'
import {Panel} from 'primereact/panel'
import {Message} from 'primereact/message'
import {ScrollPanel} from 'primereact/scrollpanel'
import {Card} from 'primereact/card'
import axios from 'axios'
import {ApiUrlBase} from '../../utils/constants'
import {TheMovieDBImagesUrlBase} from '../../utils/constants'
import {TheMovieDBUrlBase} from '../../utils/constants'
import {TheMovieDB} from '../../utils/credentials'
import {HandleImgError} from '../../utils/functions'
import {getMovieCharacters} from '../ManageMovie/functions'

export default function MovieDetail(props) {
    let {id} = useParams()
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [movie, setMovie] = useState(undefined)
    const [credits, setCredits] = useState(undefined)
    const [unknownMovieCharacters, setUnknownMovieCharacters] = useState(undefined)
    const [knownMovieCharacters, setKnownMovieCharacters] = useState(undefined)
    const loaded = useRef(false)

    useEffect(() => {
        try {
            if (loaded.current) return
            loaded.current = true
            if (id || props.id) {
                Promise.all([
                    axios.get(`${ApiUrlBase}/movie/${id ? id : props.id}`),
                    axios.get(`${ApiUrlBase}/character`),
                ])
                .then((responses) => {
                    setMovie(responses[0].data)
                    if (responses[0].data && responses[0].data.id) {
                        axios.get(`${TheMovieDBUrlBase}/movie/${responses[0].data.id}/credits?api_key=${TheMovieDB}`)
                        .then((response) => {
                            setCredits(response.data)
                            if (responses[1].data && response.data) {
                                setUnknownMovieCharacters(getMovieCharacters(responses[1].data, response.data.cast, false))
                                setKnownMovieCharacters(getMovieCharacters(responses[1].data, response.data.cast))
                            }
                        })
                        .catch((_) => {
                            handleStatus(true, 'error' ,'Ocurrio un error al obtener datos de la pelicula :(')
                        })
                    }
                    
                })
                .catch((_) => {
                    handleStatus(true, 'error' ,'Ocurrio un error al obtener datos de la pelicula :(')
                })
            }
        } catch (error) {
            handleStatus(true, 'error' ,'¡Ooops, ha ocurrido un error!')
        }
    }, [id, props]);

    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    const header = (
        <img 
            alt="Card" 
            src={'/images/Logos/ProfileUnknow.png'}
            onError={e => HandleImgError(e)}
        />
    );

    return (
        <div className="charDetail">

            <div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>

            {
                movie
                ?
                    <div className="p-grid p-justify-around m10">

                        <div className="p-col p-justify-center">
                            <div className="p-grid p-justify-center m10">
                                {/* Poster of movie */}
                                {
                                    movie.poster_path !== ''
                                    ?   
                                        <img 
                                            src={`${TheMovieDBImagesUrlBase}${movie.poster_path}`} 
                                            key={movie.id} 
                                            alt={`img`} 
                                            onError={e => HandleImgError(e)}
                                            style={{
                                                background: 'white', 
                                                objectFit: 'contain',
                                                objectPosition: 'center center',
                                                height: '100%',
                                                maxHeight: '100vh',
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
                                                maxHeight: '100vh',
                                            }}
                                        />
                                }
                            </div>
                        </div>
                    
                        <div className="p-col">
                            <Panel className="m10" header={movie.title} style={{textAlign: 'center'}}>
                                <p className="movieName">Año de lanzamiento: {movie.release_date}</p>
                                <hr/>
                                <p className="movieBiography" align="justify">{movie.overview}</p>
                            </Panel>

                            <Panel className="m10" header="Personajes" style={{textAlign: 'center'}}>
                                <ScrollPanel style={{width: '100%', height: '200px'}} className="custombar2">
                                {
                                    knownMovieCharacters && unknownMovieCharacters
                                    ?
                                        <div className="p-grid p-justify-center">
                                        {
                                            knownMovieCharacters.map((character, i) => (
                                                <div className="p-col-6 p-md-6" key={i}>
                                                    <CharCard character={character}/>
                                                </div>
                                            ))
                                        }
                                        {
                                            unknownMovieCharacters.map((character, i) => (
                                                <div className="p-col-6 p-md-6" key={i}>
                                                    <Card title={character} className="ui-card-shadow m5" header={header}/>
                                                </div>
                                            ))
                                        }
                                        </div>

                                    :
                                        <ProgressSpinner 
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginRight: '-50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        />
                                }                            
                                </ScrollPanel>
                            </Panel>

                            <Panel className="m10" header="Casting" style={{textAlign: 'center'}}>
                                <ScrollPanel style={{width: '100%', height: '200px'}} className="custombar2">
                                {
                                    credits
                                    ?
                                        <div className="p-grid p-justify-center">
                                        {
                                            credits.cast.map((character, i) => (
                                                <div className="p-col-6 p-md-4" key={i}>
                                                    <CharMovieCard character={character}/>
                                                </div>
                                            ))

                                        }
                                        </div>

                                    :
                                        <ProgressSpinner 
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginRight: '-50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        />
                                }                            
                                </ScrollPanel>
                            </Panel>
                        </div>

                    </div>
            
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
    )
}