import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(220);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    const onRequestItems = (offset, initialValue) => {
        initialValue ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let charEnded = false;
        if (newCharList.length < 9) {
            setCharEnded(true);
        }

        setCharList(charList => [...charList, ...newCharList]);
        setOffset(offset => offset + 9);
        setNewItemLoading(false);
        setCharEnded(charEnded);
    }

    const itemRefs = useRef([])


    const setFocus = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    useEffect(() => {
        onRequestItems(offset, true);
    }, [])

    const renderItems = (data) => {
        const elem = data.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
                <li
                    tabIndex={0}
                    ref={(el) => itemRefs.current[i] = el}
                    className="char__item"
                    key={item.id}
                    onClick={() => {
                        setFocus(i);
                        props.onSelectId(item.id);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            setFocus(i);
                            props.onSelectId(item.id);
                        }
                    }}>
                    <img src={item.thumbnail} alt="abyss" style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {elem}
            </ul>
        )
    }

    const items = renderItems(charList);
    const errorMe = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    return (
        <div className="char__list">
            {errorMe}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                onClick={() => onRequestItems(offset)}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                disabled={newItemLoading}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onSelectId: PropTypes.func
}



export default CharList;