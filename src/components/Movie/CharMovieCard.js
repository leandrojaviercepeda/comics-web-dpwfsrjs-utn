import React from 'react'
import {Card} from 'primereact/card'
import {API_MOVIE_DB_IMG} from '../../utils/constants'
import {HandleImgError} from '../../utils/functions'

export default function CharMovieCard(props) {

    const header = (
        props.character.profile_path
        ? 
            <img 
                alt={props.character.name} 
                src={`${API_MOVIE_DB_IMG}${props.character.profile_path}`}
                onError={e => HandleImgError(e)}
            />
        : 
            <img 
                alt={props.character.name} 
                src={'/images/Logos/Profile.png'}
                onError={e => HandleImgError(e)}
            />
    );

    return (
        <Card 
            title={props.character.name}
            subTitle={`${props.character.character}`}
            className="ui-card-shadow m5" 
            header={header}
        />
    )
}