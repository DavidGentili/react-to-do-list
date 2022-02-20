import { React, useState, useEffect } from 'react'
import './App.css'
import imageLoad from './spinner.png'

import api from './api';

const intialListItems = () => {
    const items = JSON.parse(localStorage.getItem('listItems'));
    return (items && Array.isArray(items)) ? items : []
}

function App() {
    
    const [openForm, setOpenForm] = useState(false);
    const [listItems, setListItems] = useState([]);
    const [newItemValue, setNewItemValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [counterId, setCounterId] = useState(1);
    const [mode, setMode] = useState('light');

    useEffect(() => {
        Promise.all([api.items.fetch(), api.id.fetch()])
        .then(res => {
            setListItems(res[0]);
            setCounterId(res[1]);
            setLoading(false);
        })
    }, [])
    
    useEffect(() => {
        setNewItemValue('');
    }, [openForm]);
    

    const handlerCloseForm = (e) => {
        e.preventDefault();
        setOpenForm(false);
    }

    const handlerSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            id: counterId,
            value: newItemValue,
        }
        const newListItems = [...listItems, newItem];
        const newId = counterId + 1;
        setLoading(true);
        Promise.all([api.items.update(newListItems),api.id.update(newId)])
        api.items.update(newListItems).then(() =>{
            setCounterId(newId);
            setListItems(newListItems);
            setOpenForm(false);
            setLoading(false);
        });
        
    }

    const eventRemove = (id) => {
        return (e) => {
            const newListItems = listItems.filter(item => item.id !== id)
            setLoading(true);
            api.items.update(newListItems).then(() => {
                setListItems(newListItems);
                setLoading(false);
            })
        }
    }

    const handlerChangeMode = (e) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        document.querySelector('body').style.backgroundColor = (mode === 'light') ? '#00253E' : ''
    }

    return (
        <div className={`App ${mode === 'dark' ? 'App-Dark' : ''}`}>
                <button className='buttonChangeMode' onClick={handlerChangeMode}>Theme: {mode}</button>
                <h1>My List</h1>
                <h4>{listItems.length} item(s)</h4>
                <ul>
                    {
                        (loading && listItems.length === 0 && !openForm) ? <img className='loadingImg' src={imageLoad} alt="loading.." /> : (
                            listItems.map((item) => {
                                return ( 
                                    <li key={item.id}>
                                        <p>{item.value}</p>
                                        {!loading && <button onClick={eventRemove(item.id)}>Remove</button>}
                                    </li>
                                )
                            })
                        ) 
                        
                    }
                </ul>
                <button disabled={loading} onClick={(e) => {setOpenForm(!openForm)}}>add new element</button>

                {openForm && <div className="addForm">
                    <form onSubmit={handlerSubmit}>
                        {!loading && <button className='buttonClose' type='button' onClick={handlerCloseForm} >X</button>}
                        <h3>Add item</h3>
                        <input autoFocus type="text" value={newItemValue} placeholder='item...' onChange={(e) => {setNewItemValue(e.target.value)}} />
                        <button disabled={loading} className='buttonAdd' type='submit'>Add</button>
                    </form>
                </div>}
        </div>
    )
}

export default App
