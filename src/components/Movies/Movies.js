import React, {useState} from 'react'
import MoviesList from './MoviesList'
import MoviesSearcher from './MoviesSearcher'

export default function Movies() {
    
    const [movieSearched, setMovieSearched] = useState('')
    const handleMovieSearched = list => setMovieSearched(list)

    return (
        <div>
            <div className='p-grid p-justify-center m5'>
                <MoviesSearcher 
                    handleMovieSearched={handleMovieSearched}
                />
            </div>
            <MoviesList
                movieSearched={movieSearched}
            />
        </div>
    )
}
