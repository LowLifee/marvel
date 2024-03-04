import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

    state = {
        char: {},
        loading: true,
        error: false,
        id: Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
    }

    marvelService = new MarvelService();

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onUpdateChar = () => {
        this.marvelService.getCharacter(this.state.id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onRandomId = () => {
        this.setState({
            id: Math.floor(Math.random() * (1011400 - 1011000) + 1011000),
            loading: true
        })
        this.onUpdateChar();
    }

    componentDidMount() {
        this.onUpdateChar();
    }

    componentWillUnmount() {

    }

    render() {
        const { char, loading, error } = this.state;
        const spinner = loading ? <Spinner /> : null,
            errorMes = error ? <ErrorMessage /> : null,
            content = !(spinner || error) ? <View char={char} /> : null;

        return (
            <div className="randomchar" >
                {spinner}
                {errorMes}
                {content}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button
                        className="button button__main"
                        onClick={this.onRandomId}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const View = ({ char }) => {

    const { name, thumbnail, wiki, homepage, description } = char;
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <div className="randomchar__block">
            <img
                src={thumbnail}
                alt="Random character"
                className="randomchar__img"
                style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;