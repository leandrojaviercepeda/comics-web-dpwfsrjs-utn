import React, {useState, useEffect} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {ProgressSpinner} from 'primereact/progressspinner';

export default function CharSelector(props) {
    const [items, setItems] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [searched, setSearched] = useState('')
    
    useEffect(() => {
      if (Array.isArray(props.items) && props.items) {
        if (props.items.every(item => {
            const keys = Object.keys(item)
            if (keys.includes("id") && keys.includes("name")) return true
            return false
          })
        ) {
          setItems(props.items)
        }
      }
    }, [props])

    const getItem = (target) => {
      const index = items.findIndex(item => item.name === target)
      if (target && target !== '' && index >= 0) {
        return items[index]
      }
    }

    const suggestItems = event => {
      setTimeout(() => {
        let results;
        if (event.query === '') {
          results = [...items];
        } else {
          results = suggestions.filter(item => item.name.toLowerCase().includes(event.query.toLowerCase()));
        }
        setSuggestions(results);
		  }, 250);
    }

    return (
        <div className="charSelector">
            <div className="p-grid p-justify-center m10">
                {
                    Array.isArray(suggestions)
                    ? 
                        <AutoComplete 
                            value={searched} 
                            suggestions={Array.isArray(suggestions) ? suggestions.map(item => item.name) : []}
                            placeholder="Buscar..." 
                            size={30}
					                  minLength={1}
                            dropdown={true} 
                            onChange={e => setSearched(e.target.value)}
                            onSelect={e => props.onSelect(getItem(e.value))}
                            completeMethod={e => suggestItems(e)}
                            onKeyPress={(e) => e.key === 'Enter' ? props.onSearch(getItem(searched)) : null}
                        />
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