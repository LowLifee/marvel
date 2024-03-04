import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {

    state = {
        loading: true,
        error: false,
        charList: [],
        newItemLoading: false,
        //offset: 1554,
        offset: 220,
        charEnded: false
    }



    marvelServce = new MarvelService();

    onNewItemLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onRequestItems = (offset) => {
        this.onNewItemLoading();
        this.marvelServce.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (newCharList) => {
        let charEnded = false;
        if (newCharList.length < 9) {
            charEnded = true;
        }

        this.setState(({ offset, charList }) => ({
            loading: false,
            charList: [...charList, ...newCharList],
            offset: offset + 9,
            newItemLoading: false,
            charEnded: charEnded
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref)
    }

    setFocus = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    //char__item_selected;

    componentDidMount() {
        this.onRequestItems();
    }

    renderItems = (data) => {
        const elem = data.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
                <li
                    tabIndex={0}
                    ref={this.setRef}
                    className="char__item"
                    key={item.id}
                    onClick={() => {
                        this.setFocus(i);
                        this.props.onSelectId(item.id);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.setFocus(i);
                            this.props.onSelectId(item.id);
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

    render() {
        const { loading, error, charList, newItemLoading, offset, charEnded } = this.state;
        const items = this.renderItems(charList);
        const errorMe = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const element = !(loading || error) ? items : null;
        return (
            <div className="char__list">
                {errorMe}
                {spinner}
                {element}
                <button
                    className="button button__main button__long"
                    onClick={() => this.onRequestItems(offset)}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    disabled={newItemLoading}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectId: PropTypes.func
}



export default CharList;