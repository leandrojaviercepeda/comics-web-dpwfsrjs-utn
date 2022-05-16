import React, {useState, useEffect, useRef} from 'react';
import ItemSelector from '../../Shared/ItemSelector'
import MovieDetail from '../../Movie/MovieDetail'
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button'
import {Message} from 'primereact/message';
import {Panel} from 'primereact/panel';
import {OverlayPanel} from 'primereact/overlaypanel';
import axios from 'axios'
import {API_COMICS} from '../../../utils/constants'

export default function DeleteMovie(props) {
    var op = {toggle: e => e}
    const [items, setItems] = useState(undefined)
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [movieToDelete, setMovieToDelete] = useState('')
    const [movie, setMovie] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const loaded = useRef(false)
    
    useEffect(() => {
        try {
            if (loaded.current) return
            if (!items) {
                loaded.current = true
                axios.get(`${API_COMICS}/movie`)
                .then((response) => {
                    setItems(response.data)
                })
                .catch((error) => {
                    console.error(error)
                    handleStatus(true, 'error', 'Ocurrio un error al obtener datos.')
                })
            }
        } catch (error) {
            console.error(error)
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }, [items]);

    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    const onSelect = data => {
        if (data && data.id && data.id !== '') {
            const searched = items.find(item => item.id_movie === data.id)
            setMovie(searched)
        }
    }
    const onSearch = data => {
        if (data && data.id && data.id !== '') {
            const searched = items.find(item => item.id_movie === data.id)
            setMovie(searched)
        }
    }

    const handleDeleteMovie = id => {
        try{
            setDisabled(true)
            axios.delete(`${API_COMICS}/movie/${id}`)
            .then(() => {
                handleStatus(true, 'success', '¡Pelicula eliminada exitosamente! :)')
                setInterval(() => {
                    handleStatus(false)
                    refreshPage()
                }, 2000)
            })
            .catch(() => {
                handleStatus(true, 'error', 'Ocurrio un error al eliminar pelicula :(')
                setDisabled(false)
            })
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }

    const refreshPage = () => window.location.reload(true)

    return (
        <div className="deleteMovie">

            <div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>
            <div className="p-col fixed m10">
                <div className="p-grid p-justify-center">
                    {
                        items &&
                        <ItemSelector 
                            items={[...items.map(item => ({id: item.id_movie, name: item.title}))]}
                            onSelect={onSelect} 
                            onSearch={onSearch}
                        />
                    }
                </div>
            </div>

            <div className="p-col fixed m10">
                <div className="p-grid p-justify-center">
                    <Button 
                        className="p-button-warning"
                        label="Borrar" 
                        icon="pi pi-trash" 
                        disabled={!movie || disabled ? true : false}
                        onClick={e => op.toggle(e)}
                        aria-controls="overlay_panel" 
                        aria-haspopup={true}
                    />
                    {
                        movie 
                        ?
                        <div className="p-grid p-justify-center">
                        
                            <OverlayPanel className="p-col-6" ref={el => op = el} id="overlay_panel" showCloseIcon={true} >
                                <Message/>
                                <Panel 
                                    header="¿Estás absolutamente seguro?" 
                                    style={{textAlign: 'center'}}
                                >   
                                    <div className="p-grid p-justify-center">
                                        <div className="p-col fixed">
                                            <h4 
                                                style={{
                                                    color: '#735c0f', 
                                                    backgroundColor: '#fffbdd', 
                                                    textAlign: 'center'
                                                }}
                                            >
                                                ¡Cosas inesperadas sucederan si no lees esto!
                                            </h4>
                                            <hr/>
                                            <p 
                                                align="justify" 
                                                style={{textAlign: 'center'}}
                                            >
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente la pelicula <b>{movie?.title}</b>.
                                            Por favor, escriba <b>{movie?.title}</b> para confirmar.
                                            </p>
                                            <hr/>
                                        </div>
                                    </div>
                                    <div className="p-grid p-dir-col p-justify-center">
                                        <div className="p-col fixed">
                                        <InputText
                                            onChange={e => setMovieToDelete(e.target.value)}
                                        />
                                        </div>
                                        <div className="p-col fixed">
                                        <Button 
                                            className="p-button-danger"
                                            label="Entiendo las consecuencias, quiero borrar la pelicula." 
                                            icon="pi pi-trash" 
                                            disabled={movieToDelete !== movie?.title ? true : false}
                                            onClick={() => handleDeleteMovie(movie?.id_movie)}
                                        />
                                        </div>
                                    </div>
                                </Panel>
                            </OverlayPanel>

                        </div>
                        : null
                    }
                    
                </div>
            </div>

            {
                movie &&
                <div className="p-col fixed m10">
                    <div className="p-grid p-justify-center">
                        <MovieDetail id={movie?.id_movie}/>
                    </div>
                </div>
            }

        </div>
    )
}