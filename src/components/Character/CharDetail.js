import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router'
import {ProgressSpinner} from 'primereact/progressspinner'
import {Panel} from 'primereact/panel'
import {Message} from 'primereact/message'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import {Carousel} from 'react-responsive-carousel'
import axios from 'axios'
import {API_COMICS} from '../../utils/constants'
import {HandleImgError} from '../../utils/functions'
import {capitalize} from '../../utils/functions'

export default function CharDetail(props) {
    let {id} = useParams()
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [character, setCharacter] = useState(undefined)
    const [movies, setMovies] = useState(undefined)
    const [characterMovies, setCharacterMovies] = useState(undefined)
    const loaded = useRef(false)
    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    const filterCharacterMovies = (movies, characterMovies) => {
        if (!movies || ! characterMovies) return []
        const moviesNames = [...movies.map(movie => movie.title)]
        const moviesNamesOfThisCharacter = [...moviesNames.filter(movie => characterMovies.includes(movie))]
        return [...movies.filter(movie => moviesNamesOfThisCharacter.includes(movie.title))]
    }

    useEffect(() => {
        try {
            if (loaded.current) return
            loaded.current = true
            if (id || props.id) {
                Promise.all([
                    axios.get(`${API_COMICS}/character/${id ? id : props.id}`),
                    axios.get(`${API_COMICS}/movie`),
                ])
                .then((responses) => {
                    setCharacter(responses[0].data)
                    setMovies(responses[1].data)
                    if (responses[0].data && responses[1].data)
                        setCharacterMovies(filterCharacterMovies(responses[1].data, responses[0].data.movies))
                })
                .catch((_) => {
                    handleStatus(true, 'error' ,'Ocurrio un error al obtener datos del personaje :(')
                })
            }
        } catch (error) {
            handleStatus(true, 'error' ,'¡Ooops, ha ocurrido un error!')
        }
    }, [id, props]);

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
                character && movies
                ?
                    <div className='p-grid p-justify-around' style={{gap: '1em'}}>

                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                            {/* Carousel of images */}
                            <Carousel 
                                showArrows={true}
                                showThumbs={false}
                                showIndicators={false}
                                showStatus={false}
                            >
                            {
                                character && Array.isArray(character?.images) && character?.images.length !== 0
                                ? 
                                    character?.images.slice(0, parseInt(character?.amount_images)).map((img, index) => 
                                        <img 
                                            src={img} 
                                            key={index+1} 
                                            alt={`img-${index+1}`} 
                                            onError={e => HandleImgError(e)}
                                            style={{
                                                background: 'white', 
                                                objectFit: 'contain',
                                                objectPosition: 'center center',
                                                height: '100%',
                                                maxHeight: '75vh',
                                            }}
                                        />
                                    )
                                : 
                                    <img 
                                        src={`/images/Logos/${character?.house === 'dc' ? character?.house.toLocaleUpperCase() : capitalize(character?.house)}.png`} 
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
                    
                        <div style={{minWidth: '50%', maxWidth: '75%'}}>
                            <Panel header={character?.character_name} style={{textAlign: 'center'}}>
                                <h4 className="charName">Nombre: {character?.name || ''}</h4>
                                <hr/>
                                <p className="charName">Año de aparición: {character?.year_of_appearance || ''}</p>
                                <hr/>
                                {character?.house && <p>Casa: <span className={`fa fa-${character?.house.toLowerCase()} m5`}style={{textAlign: 'center'}}/> </p>}
                                <hr/>
                                {Array.isArray(character?.equipment) && <p className="charEquip">Equipamiento: { `${character?.equipment.map(e => e)}`}</p>}
                                <hr/>
                                <p className="charBiography" align="justify">{character?.biography}</p>
                                <hr/>
                                <p className="charBiography" align="justify">Peliculas en las que aparece:
                                {
                                    characterMovies && Array.isArray(characterMovies) &&
                                    characterMovies.map((movie, index) =>(
                                        <a key={index+1} href={`/movies/${movie.id_movie}`}>{` ${movie.title},`}</a>         
                                    ))
                                }
                                </p>
                            </Panel>
                        </div>

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
        </div>
    )
}