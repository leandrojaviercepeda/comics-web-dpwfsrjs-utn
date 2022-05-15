import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router'
import ItemSelector from '../../Shared/ItemSelector'
import {Message} from 'primereact/message'
import {InputText} from "primereact/inputtext"
import {InputMask} from 'primereact/inputmask'
import {InputTextarea} from 'primereact/inputtextarea'
import {InputNumber} from 'primereact/inputnumber'
import {Chips} from 'primereact/chips'
import {Button} from 'primereact/button'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import {Carousel} from 'react-responsive-carousel'
import axios from 'axios'
import {ApiUrlBase} from '../../../utils/constants'
import {capitalize} from '../../../utils/functions'
import { HandleImgError } from '../../../utils/functions'
import "./css/style.css"

export default function EditChar(props) {
    let {house} = useParams()
    const [character, setCharacter] = useState(undefined)
    const [items, setItems] = useState(undefined)
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
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
                    handleStatus(true, 'error', 'Ocurrio un error al obtener datos :(')
                })
            }
        } catch (error) {
            console.error(error)
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }, [house]);

    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})
    
    const handleForm = (caption, value) => {
        if (caption === 'equipment') return setCharacter({...character, [caption]: Array.isArray(value) &&  value.length !== 0 ? value.map(e => e !== '' ? capitalize(e) : '') : []})
        if (caption === 'amount_images') return setCharacter({...character, [caption]: value ? parseInt(value) : 0})
        return setCharacter({...character, [caption]: value})
    }

    const onSelect = data => {
        if (data && data.id && data.id !== '') {
            const searched = items.find(item => item.id_charact === data.id)
            setCharacter(searched)
        }
    }
    const onSearch = data => {
        if (data && data.id && data.id !== '') {
            const searched = items.find(item => item.id_charact === data.id)
            setCharacter(searched)
        }
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault()

            if (
                character?.character_name === '' ||
                character?.year_of_appearance === '' ||
                character?.house === '' ||
                character?.biography === '' ||
               ( Array.isArray(character?.images) && character?.images.length === 0) ||
                character?.amount_images <= 0 ||
                (Array.isArray(character?.images) && character?.images.length < character?.amount_images)
            ) {
                return handleStatus(true, 'info', 'Debe tener en cuenta que los campos vacíos permitidos son "Nombre" y "Equipamiento", ademas la cantidad de imagenes para mostrar debe ser menor o igual a las ingresadas.')
            }

            setDisabled(true)
            axios.put(`${ApiUrlBase}/character/${character?.id_charact}`, character)
            .then(() => {
                handleStatus(true, 'success', '¡Personaje editado exitosamente! :)')
                setInterval(() => {
                    handleStatus(false)
                    refreshPage()
                }, 2000)
            })
            .catch(() => {
                handleStatus(true, 'error', 'Ocurrio un error al editar personaje :(')
                setDisabled(false)
            })
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }

    const refreshPage = () => window.location.reload(true)

    const customChip= item => {
        return (
            <small className="p-chips-token"
                style={{
                    fontSize: '12px',
                    width: "100px",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                }}
            >{item}</small>
        );
    }

    return (
        <div className="deleteChar">

            <div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>
            
            <div className="p-grid p-dir-col p-justify-center m10">
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
            

            <form className='p-grid p-justify-around' style={{gap: '1em'}} onSubmit={handleSubmit}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                    {/* Carousel of images */}
                    <Carousel
                        className='control-next.control-arrow'
                        showArrows={true}
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={false}
                    >
                        {
                            character && Array.isArray(character?.images) && character?.images.length !== 0
                            ? 
                                character?.images.slice(0, parseInt(character?.amount_images)).map((img, i) => 
                                    <img 
                                        className='img'
                                        src={img} 
                                        key={i+1} 
                                        alt={`img-${i+1}`} 
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
                                    src={`/images/Logos/${house === 'dc' ? house.toLocaleUpperCase() : capitalize(house)}.png`} 
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
                    {/* Casa */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon" style={{textAlign: 'center'}}>
                            <i className="pi pi-home"></i>
                        </span>
                        <span 
                            className={`fa fa-${house} m5`}
                            style={{textAlign: 'center'}}
                        />
                    </div>

                    {/* Nombre de personaje */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText
                            disabled={!character} 
                            value={character?.character_name || ''}
                            placeholder="Nombre de personaje"
                            onChange={e => handleForm('character_name', capitalize(e.target.value))}
                            required
                            style={{width: '70%'}}
                        />
                    </div>

                    {/* Nombre */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-star"></i>
                        </span>
                        <InputText
                            disabled={!character}
                            value={character?.name || ''}
                            placeholder="Nombre" 
                            onChange={e => handleForm('name', capitalize(e.target.value))}
                            style={{width: '70%'}}
                        />
                    </div>

                    {/* Año de aparicion */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar"></i>
                        </span>
                        <InputMask 
                            disabled={!character}
                            mask="9999" 
                            value={`${character?.year_of_appearance}` || ''}
                            placeholder="Año de aparicion"
                            slotChar="yyyy" 
                            onChange={e => handleForm('year_of_appearance', e.target.value)}
                            required
                            style={{width: '70%'}}
                        />
                    </div>
                    
                    {/* Equipamiento */}
                    <div className='p-col'style={{display: 'flex', justifyContent: 'center'}}>
                        <Chips
                            disabled={!character} 
                            placeholder="Equipamiento"
                            value={character?.equipment || []} 
                            onChange={e => handleForm('equipment', e.target.value)}
                            itemTemplate={customChip}
                            style={{display: 'flex', justifyContent: 'center', minWidth: '75%', maxWidth: '75%'}}
                        />
                    </div>

                    {/* Imagenes */}
                    <div className='p-col' style={{display: 'flex', justifyContent: 'center'}}>
                        <Chips
                            disabled={!character}
                            placeholder="Imagenes"
                            value={character?.images || []}
                            onChange={e => handleForm('images', e.target.value)} 
                            itemTemplate={customChip}
                            style={{display: 'flex', justifyContent: 'center', minWidth: '75%', maxWidth: '75%'}}
                        />
                    </div>

                    {/* Cantidad de imagenes*/}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-images"></i>
                        </span>
                        <InputNumber
                            disabled={!character} 
                            value={parseInt(character?.amount_images) || 0} 
                            onChange={e => handleForm('amount_images', e.target.value)}
                            min={0} 
                            max={100}
                            required
                            style={{width: '70%'}}
                        />
                    </div>

                    {/* Biografia */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <InputTextarea
                            disabled={!character} 
                            rows={5} 
                            cols={30} 
                            value={character?.biography}
                            onChange={e => handleForm('biography', e.target.value)} 
                            autoResize={true}
                            required
                            style={{width: '75%'}}
                        />
                    </div>

                    <div className="p-grid p-justify-center m10">
                        <Button type="submit" className="p-button-warning" label="Editar" icon="pi pi-check" disabled={!character || disabled}/>
                    </div>
                </div>
            </form>

        </div>
    )
}