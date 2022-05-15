import React from 'react';
import {Menubar} from 'primereact/menubar';
import './css/style.css'

export default function Navbar() {
    const menuItems = [
      {
        label: null,
        icon: 'fa fa-home',
        url: '/home',
      },
      {
        label: null, 
        icon: 'fa fa-dc', 
        items: [
          {label:"New", icon: 'pi pi-fw pi-plus', url: '/characters/dc/new'},
          {label:"Edit", icon: 'pi pi-fw pi-pencil', url: '/characters/dc/edit'},
          {label:"Delete", icon: 'pi pi-fw pi-trash', url: '/characters/dc/delete'},
        ]},
      {
        label: null, icon: 'fa fa-marvel',
        items: [
          {label:"New", icon: 'pi pi-fw pi-plus', url: '/characters/marvel/new'},
          {label:"Edit", icon: 'pi pi-fw pi-pencil', url: '/characters/marvel/edit'},
          {label:"Delete", icon: 'pi pi-fw pi-trash', url: '/characters/marvel/delete'},
        ]
      },
      {
        label: null, icon: 'fa fa-movies',
        items: [
          {label:"New", icon: 'pi pi-fw pi-plus', url: '/movies/new'},
          {label:"Delete", icon: 'pi pi-fw pi-trash', url: '/movies/delete'},
        ]
      },
      {
        label: null,
        icon: 'fa fa-contact',
        url: '/contact'
      },
    ]

    return (
      <nav className="m5">
        <Menubar className='ui-menuitem' model={menuItems}/>
      </nav>
   )
}


      