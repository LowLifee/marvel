import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';


class CharInfo extends Component {

    state = {
        loading: false,
        error: false,
        char: null
    }

    marvelService = new MarvelService();

    updateChar = () => {

        const { charId } = this.props;
        if (!charId) {
            return;
        }


        this.onLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }


    onCharListLoaded = (char) => {
        this.setState({
            loading: false,
            char
        })
    }

    onLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {

        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    render() {
        const { error, loading, char } = this.state;
        const skeleton = loading || error || char ? null : <Skeleton />;
        const errorMe = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(error || loading || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info" >
                {skeleton}
                {errorMe}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }

    let liElem = 'there is no comics for this character.';
    if (comics.length > 9) {
        liElem = comics.slice(0, 9).map((item, i) => {
            return (
                <li key={i} className="char__comics-item">
                    {item.name}
                </li>
            )
        });
    }
    if (comics.length < 9) {
        comics.map((item, i) => {
            return (
                <li key={i} className="char__comics-item">
                    {item.name}
                </li>
            )
        });
    }


    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}
                    style={imgStyle}
                />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {liElem}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;