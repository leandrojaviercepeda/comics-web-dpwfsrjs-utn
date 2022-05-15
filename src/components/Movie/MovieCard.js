import React from 'react'
import {Card} from 'primereact/card'
import {TheMovieDBImagesUrlBase} from '../../utils/constants'
import {HandleImgError} from '../../utils/functions'

export default function CharCard(props) {

    const header = (
        <img 
            alt="Card" 
            src={`${TheMovieDBImagesUrlBase}${props.movie.poster_path}`}
            onError={e => HandleImgError(e)}
        />
    );
    const footer = (
        <span>
            <a className="detail" href={`/movies/${props.movie.id_movie}`}>Detalle</a>
        </span>
    );
    return (
        <Card 
            title={props.movie.title} 
            subTitle={`${props.movie.title} (${props.movie.release_date})`} 
            style={{maxWidth: '280px', minWidth: '250px'}} 
            className="ui-card-shadow m5" 
            header={header}
            footer={footer} 
        >
            <div>
                <p
                style={{
                    width: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                >
                    {props.movie.overview}
                </p>
            </div>
        </Card>
    )
}