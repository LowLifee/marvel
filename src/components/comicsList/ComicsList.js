import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import './comicsList.scss';



const ComicsList = () => {
    const { loading, error, getAllComics } = useMarvelService();
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoad] = useState(false);
    const [comicEnded, setComicEnden] = useState(false);

    useEffect(() => {
        onRequestItem(offset, true);
    }, [])

    const onRequestItem = useCallback((offset, initial) => {
        initial ? setNewItemLoad(false) : setNewItemLoad(true);
        getAllComics(offset)
            .then(onComicsLoaded)
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

    const spinner = loading && !error ? <Spinner /> : null;
    const errorMe = error && !loading ? <ErrorMessage /> : null;
    const content = renderItems(comics);

    return (
        <div className="comics__list">
            {spinner}
            {errorMe}
            {content}
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



