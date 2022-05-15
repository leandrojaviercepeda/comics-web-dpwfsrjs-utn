import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import './App.css'
import Home from './components/Home/Home'
import NewChar from './components/ManageChar/NewChar'
import EditChar from './components/ManageChar/EditChar'
import DeleteChar from './components/ManageChar/DeleteChar'
import Character from './components/Character'
import NewMovie from './components/ManageMovie/NewMovie'
import DeleteMovie from './components/ManageMovie/DeleteMovie'
import Movie from './components/Movie'
import Contact from './components/Contact'
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' render={ () => <Redirect to='/home' component={ Home }/>}/>
        <Route exact path='/home' component={ Home }/>
        <Route exact path='/characters/:house/new' component={ NewChar }/>
        <Route exact path='/characters/:house/edit' component={ EditChar }/>
        <Route exact path='/characters/:house/delete' component={ DeleteChar }/>
        <Route exact path='/characters/:house/:id' component={ Character }/>
        <Route exact path='/movies/new' component={ NewMovie }/>
        <Route exact path='/movies/delete' component={ DeleteMovie }/>
        <Route exact path='/movies/:id' component={ Movie }/>
        <Route exact path='/contact' component={ Contact }/>
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}


export default App;
