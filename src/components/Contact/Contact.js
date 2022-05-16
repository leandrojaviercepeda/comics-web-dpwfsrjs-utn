import React, { useEffect, useState } from 'react'
import {API_COMICS} from '../../utils/constants'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import axios from 'axios'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'

export default function Contact(props) {
	const formDefault = {
		to: 'comicsdpwfsrjs@gmail.com',
		subject: '',
		text: '',
	}
	const [form, setForm] = useState(formDefault)
	const [disabled, setDisabled] = useState(true)
	const [status, setStatus] = useState({showMessage: false, type: '', message:''})

	const handleStatus = (showMessage, type='', message='') => setStatus({showMessage: showMessage, type: type, message: message})
	const handleForm = (caption, value) => setForm({...form, [caption]: value})

	useEffect(() => {
		if (Object.values(form).every(value => value !== '')) {
			setDisabled(false)
		} else {
			setDisabled(true)
		}
	}, [form])

	const handleSubmit = async (e) => {
		try {
			e.preventDefault()
                                    
            if (
                form.to === '' ||
                form.subject === '' ||
                form.text === ''
            ) 
                return handleStatus(true, 'info', 'Todos los campos deben estar completos.')
            
            const response = await axios.post(`${API_COMICS}/contact`, form)
            if (response) {
                handleStatus(true, 'success', '¡Email enviado exitosamente! :)')
                setInterval(() => handleStatus(false), 2000)
                setForm(formDefault)
            } 
        } catch (error) {
            handleStatus(true, 'error', '¡Ooops, ha ocurrido un error!')
        }
	}

  	return (
		<>
			<div className="p-grid p-justify-center m10">
                {
                    status.showMessage
                    ? <Message severity={status.type} text={status.message} style={{textAlign: 'center', maxWidth: '75%'}}/>
                    : null
                }
            </div>
			
			<div className="p-grid p-justify-center m10">
                <p>
					¡Contactanos via email para obtener soporte!
				</p>
            </div>

			<form className='p-grid p-justify-around p-dir-col m10' onSubmit={handleSubmit}>
				{/* To */}
				<div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
					<span className="p-inputgroup-addon">
						<i className="pi pi-envelope"></i>
					</span>
					<InputText
						// value={form.to}
						placeholder="Para: comicsdpwfsrjs@gmail.com" 
						// onChange={e =>  handleForm('to', e.target.value)}
						style={{width: '50%'}}
						disabled
					/>
				</div>

				{/* Subject */}
				<div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
					<span className="p-inputgroup-addon">
						<i className="pi pi-envelope"></i>
					</span>
					<InputText
						value={form.subject}
						placeholder="Asunto" 
						onChange={e =>  handleForm('subject', e.target.value)}
						style={{width: '50%'}}
						required
					/>
				</div>

				{/* Text */}
				<div className="p-inputgroup m10" style={{display: 'flex', justifyContent: 'center'}}>
					<span className="p-inputgroup-addon">
						<i className="pi pi-comment"></i>
					</span>
					<InputTextarea 
						placeholder="Mensaje" 
						value={form.text}
						rows={5} 
						cols={30} 
						onChange={e => handleForm('text', e.target.value)} 
						autoResize={true}
						style={{width: '50%'}}
						required
					/>
				</div>

				<div className="p-grid p-justify-center m10">
					<Button className="p-button-primary" label="Contactar" icon="pi pi-check" disabled={disabled}/>
				</div>
			</form>
		</>
  	)
}
