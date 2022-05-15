import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router'
import ItemSelector from '../../Shared/ItemSelector'
import CharDetail from '../../Character/CharDetail'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'
import {Message} from 'primereact/message'
import {Panel} from 'primereact/panel'
import {OverlayPanel} from 'primereact/overlaypanel'
import axios from 'axios'
import {capitalize} from '../../../utils/functions'
import {ApiUrlBase} from '../../../utils/constants'

export default function DeleteChar(props) {
    let {house} = useParams()
    var op = {toggle: e => e}
    const [items, setItems] = useState(undefined)
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [characterToDelete, setCharacterToDelete] = useState('')
    const [character, setCharacter] = useState(undefined)
    const [disabled, setDisabled] = useState(false)
    const loaded = useRef(false)

    useEffect(() => {
        try {
            if (loaded.current) return
            if (house) {
                loaded.current = true
                axios.get(`${ApiUrlBase}/character?house=${house === 'dc' ? house.toLocaleUpperCase() : capitalize(house)}`)
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
    }, [house]);

    const onSelect = data => {
        if (data && data.id && data.id !== '') {
            const searched = items.find(item => item.id_charact === data.id)
            if (searched )setCharacter(searched)
        }
    }
    const onSearch = data => {
        if (data && data.id && data.id !== '') {
            const searched = items.find(item => item.id_charact === data.id)
            if (searched )setCharacter(searched)
        }
    }
    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    const handleDeleteChar = id => {
        try{
            setDisabled(true)
            axios.delete(`${ApiUrlBase}/character/${id}`)
            .then(() => {
                handleStatus(true, 'success', '¡Personaje eliminado exitosamente! :)')
                setInterval(() => {
                    handleStatus(false)
                    refreshPage()
                }, 2000)
            })
            .catch(() => {
                handleStatus(true, 'error', 'Ocurrio un error al eliminar personaje :(')
                setDisabled(false)
            })
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }

    const refreshPage = () => window.location.reload(true)

    return (
        <div className="deleteChar">

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
                            items={[...items.map(item => ({id: item.id_charact, name: item.character_name}))]}
                            house={house}
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
                        disabled={!character || disabled ? true : false}
                        onClick={e => op.toggle(e)}
                        aria-controls="overlay_panel" 
                        aria-haspopup={true}
                    />
                    {
                        character &&  
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
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el personaje <b>{character.character_name}</b>.
                                            Por favor, escriba <b>{character?.character_name}</b> para confirmar.
                                            </p>
                                            <hr/>
                                        </div>
                                    </div>
                                    <div className="p-grid p-dir-col p-justify-center">
                                        <div className="p-col fixed">
                                        <InputText
                                            onChange={e => setCharacterToDelete(e.target.value)}
                                        />
                                        </div>
                                        <div className="p-col fixed">
                                        <Button 
                                            className="p-button-danger"
                                            label="Entiendo las consecuencias, quiero borrar el personaje." 
                                            icon="pi pi-trash" 
                                            disabled={characterToDelete !== character?.character_name ? true : false}
                                            onClick={() => handleDeleteChar(character?.id_charact)}
                                        />
                                        </div>
                                    </div>
                                </Panel>
                            </OverlayPanel>

                        </div>
                    }
                    
                </div>
            </div>

            {character &&
                <div className="p-col fixed m10">
                    <div className="p-grid p-justify-center">
                        <CharDetail id={character?.id_charact}/>
                    </div>
                </div>
            }

        </div>
    )
}