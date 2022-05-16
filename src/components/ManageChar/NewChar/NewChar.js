import React, {useState} from 'react'
import {useParams} from 'react-router'
import {Message} from 'primereact/message'
import {InputText} from "primereact/inputtext"
import {InputMask} from 'primereact/inputmask'
import {InputTextarea} from 'primereact/inputtextarea'
import {InputNumber} from 'primereact/inputnumber'
import {Chips} from 'primereact/chips'
import {Button} from 'primereact/button'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import {Carousel} from 'react-responsive-carousel'
import axios from 'axios'
import {API_COMICS} from '../../../utils/constants'
import {capitalize} from '../../../utils/functions'
import { HandleImgError } from '../../../utils/functions'

export default function NewChar(props) {
    let {house} = useParams()
    let characterDefault = {
        name: '',
        character_name: '',
        year_of_appearance: '',
        house: house === 'dc' ? house.toUpperCase() : capitalize(house),
        biography: '',
        equipment: [],
        images: [],
        amount_images: 0,
    }
    const [status, setStatus] = useState({showMessage: false, type: '', message:''})
    const [character, setCharacter] = useState(characterDefault)

    const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})

    const handleForm = (caption, value) => {
        if (caption === 'equipment') return setCharacter({...character, [caption]: Array.isArray(value) &&  value.length !== 0 ? value.map(e => e !== '' ? capitalize(e) : '') : []})
        if (caption === 'amount_images') return setCharacter({...character, [caption]: value ? parseInt(value) : 0})
        return setCharacter({...character, [caption]: value})
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault()
                                    
            if (
                character.character_name === '' ||
                character.year_of_appearance === '' ||
                character.house === '' ||
                character.biography === '' ||
                character.images.length === 0 ||
                character.amount_images <= 0 ||
                character.images.length < character.amount_images
            ) 
                return handleStatus(true, 'info', 'Debe tener en cuenta que los campos vacíos permitidos son "Nombre" y "Equipamiento", ademas la cantidad de imagenes para mostrar debe ser menor o igual a las ingresadas.')
            
            const response = await axios.post(`${API_COMICS}/character`, character)
            if (response) {
                handleStatus(true, 'success', '¡Personaje guardado exitosamente! :)')
                setInterval(() => handleStatus(false), 2000)
                setCharacter(characterDefault)
            } 
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
    }

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
        <div className="newChar">

            <div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>


            <form className='p-grid p-justify-around' style={{gap: '1em'}} onSubmit={handleSubmit}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                    {/* Carousel of images */}
                    <Carousel 
                        showArrows={true}
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={false}
                    >
                        {
                            character.images.length === 0
                            ? 
                                <img 
                                    src={`/images/Logos/${character.house}.png`} 
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
                                character.images.map((img, i) => 
                                    <img 
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
                            value={character.character_name}
                            placeholder="Nombre de personaje"
                            onChange={e => handleForm('character_name',capitalize(e.target.value))}
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
                            value={character.name}
                            placeholder="Nombre" 
                            onChange={e =>  handleForm('name', capitalize(e.target.value))}
                            style={{minWidth: '70%'}}
                        />
                    </div>

                    {/* Año de aparicion */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar"></i>
                        </span>
                        <InputMask 
                            mask="9999" 
                            value={character.year_of_appearance}
                            placeholder="Año de aparicion"
                            slotChar="yyyy" 
                            onChange={e => handleForm('year_of_appearance', parseInt(e.target.value))}
                            required
                            style={{width: '70%'}}
                        />
                    </div>
                    
                    {/* Equipamiento */}
                    <div className="m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <Chips 
                            placeholder="Equipamiento"
                            value={character.equipment} 
                            onChange={e => handleForm('equipment', e.target.value)}
                            itemTemplate={customChip}
                            style={{display: 'flex', justifyContent: 'center', minWidth: '75%', maxWidth: '75%'}}
                        />
                    </div>

                    {/* Imagenes */}
                    <div className="m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <Chips
                            placeholder="Imagenes"
                            value={character.images}
                            onChange={e => handleForm('images', e.target.value)} 
                            itemTemplate={customChip}
                            style={{display: 'flex', justifyContent: 'center',  minWidth: '75%', maxWidth: '75%'}}
                        />
                    </div>

                    {/* Cantidad de imagenes*/}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-images"></i>
                        </span>
                        <InputNumber 
                            value={character.amount_images} 
                            onChange={e => handleForm('amount_images', parseInt(e.target.value))}
                            min={0} 
                            max={100}
                            required
                            style={{width: '70%'}}
                        />
                    </div>

                    {/* Biografia */}
                    <div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
                        <InputTextarea 
                            rows={5} 
                            cols={30} 
                            value={character.biography}
                            onChange={e => handleForm('biography', e.target.value)} 
                            autoResize={true}
                            required
                            style={{width: '75%'}}
                        />
                    </div>

                    <div className="p-grid p-justify-center m10">
                        <Button label="Guardar" icon="pi pi-check"/>
                    </div>
                </div>
            </form>
        </div>
    )
}