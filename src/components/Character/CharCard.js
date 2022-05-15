import React from 'react';
import {Card} from 'primereact/card';
import {HandleImgError} from '../../utils/functions';

export default function CharCard(props) {
    const header = (
        <img 
            alt="Card" 
            src={`${props.character.images[0]}`}
            onError={e => HandleImgError(e)}
        />
    );
    const footer = (
        <span>
            <a className="detail" href={`/characters/${props.character.house}/${props.character.id_charact}`}>Detalle</a>
        </span>
    );
    return (
        <Card 
            title={props.character.character_name} 
            subTitle={`${props.character.name} (${props.character.year_of_appearance})`} 
            className="ui-card-shadow m5" 
            footer={footer} 
            header={header}
            >
            <div>
                <p
                style={{
                    width: '75px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                >
                    {props.character.biography}
                </p>
            </div>
        </Card>
    )
}