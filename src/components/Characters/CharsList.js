import React, {useState, useEffect} from 'react';
import {Message} from 'primereact/message';
import CharCard from '../Character/CharCard'
import {ProgressSpinner} from 'primereact/progressspinner';
import axios from 'axios'
import {API_COMICS} from '../../utils/constants'

export default function CharsList(props) {
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [characters, setCharacters] = useState([])
    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})
    
    useEffect(() => {
        try {
            axios.get(props.listSelected === 'all' ? `${API_COMICS}/character` : `${API_COMICS}/character?house=${props.listSelected}`)
            .then((response => {
                setCharacters(response.data)
            }))
            .catch((error) => {
                console.error(error)
                handleStatus(true, 'error', 'Ocurrio un error al obtener datos :(')
            })
        } catch (error) {
            console.error(error)
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }, [props]);

    const getCharacters = characterSearched => {
        if (characterSearched !== '')
            return [...characters].filter(char => char.character_name.toLowerCase().includes(characterSearched.toLowerCase()))
        return characters
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
                    characters.length !== 0
                    ? getCharacters(props.charSearched).map((char, i) => (
                        <div className="box" key={i}>
                            <CharCard character={char}/>
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

