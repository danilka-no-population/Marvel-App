import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(1554)
    const [charEnded, setCharEnded] = useState(false)

    const marvelServ = new MarvelService()

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = (offset) => {
        onCharListLoading()
        marvelServ.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharListLoaded = (newCharList) => {

        let ended = false
        if(newCharList.length < 6){
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList])
        setLoading(false)
        setNewItemLoading(false)
        setOffset(offset => offset + 6)
        setCharEnded(ended)
    }

    const onError = () => {
        setError(true)
        setLoading(false)
    }

    const itemRefs = useRef([])

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[id].classList.add('char__item_selected')
        itemRefs.current[id].focus()
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    ref={el => itemRefs.current[i] = el}
                    tabIndex={0}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id)
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if(e.key === ' ' || e.key === 'Enter'){
                            props.onCharSelected(item.id)
                            focusOnItem(i)
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long" 
            disabled={newItemLoading} 
            onClick={() => onRequest(offset)}
            style={{display: charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;