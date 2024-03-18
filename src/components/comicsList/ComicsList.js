import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';


import './comicsList.scss';


const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return <Spinner />;
            break;
        case 'confirmed':
            return <Component />;
            break;
        case 'error':
            return <ErrorMessage />;
            break;
        default:
            return new Error('Unexpected process');
    }
}


const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoad] = useState(false);
    const [comicEnded, setComicEnden] = useState(false);

    const { getAllComics, process, setProcess } = useMarvelService();
    
    useEffect(() => {
        onRequestItem(offset, true);
    }, [])

    const onRequestItem = useCallback((offset, initial) => {
        initial ? setNewItemLoad(false) : setNewItemLoad(true);
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'));
    }, []);

    const onComicsLoaded = (newComics) => {
        let ended = false;

        if (newComics.length < 8) {
            ended = true;
        }
        setComics(comics => [...comics, ...newComics]);
        setOffset(offset => offset + 8);
        setNewItemLoad(false);
        setComicEnden(ended)
    }

    const renderItems = (arr) => {
        const item = arr.map((item, i) => {
            return (
                <li className="comics__item"
                    key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {item}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comics))}
            <button
                className="button button__main button__long"
                style={{ 'display': comicEnded ? 'none' : 'block' }}
                onClick={() => onRequestItem(offset)}
                disabled={newItemLoading}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;



