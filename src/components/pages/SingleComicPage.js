import { Helmet } from "react-helmet";
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './singleComicPage.scss';

const SingleComicPage = () => {
   const someId = useParams();
   const [comic, setComic] = useState(null);
   const [direction, setDirection] = useState(null);

   const { getComicById, getCharacter, clearError, process, setProcess } = useMarvelService();

   const updateComic = () => {
      clearError();
      setDirection(true);
      getComicById(someId.comicId)
         .then(onInfoListLoaded)
         .then(() => setProcess('confirmed'));
   }

   const updateChar = () => {
      clearError();
      setDirection(false);
      getCharacter(someId.charId)
         .then(onInfoListLoaded)
         .then(() => setProcess('confirmed'));
   }

   const onInfoListLoaded = (item) => {
      console.log(item)
      setComic(item);
   }

   useEffect(() => {
      if (someId.comicId) {
         updateComic();
      } else if (someId.charId) {
         updateChar();
      }
   }, [someId])


   return (
      <>
         {setContent(process, direction ? View : ViewChar, comic)}
      </>
   )
}

const View = ({ data }) => {

   const { title, description, pageCount, thumbnail, language, price } = data;

   return (
      <div className="single-comic">
         <Helmet>
            <meta
               name="description"
               content={`${title} comic page`}
            />
            <title>{`${title} comic page`}</title>
         </Helmet>
         <img src={thumbnail} alt={title} className="single-comic__img" />
         <div className="single-comic__info">
            <h2 className="single-comic__name">{title}</h2>
            <p className="single-comic__descr">{description}</p>
            <p className="single-comic__descr">{pageCount}</p>
            <p className="single-comic__descr">Language: {language}</p>
            <div className="single-comic__price">{price}</div>
         </div>
         <Link href="#" className="single-comic__back">Back to all</Link>
      </div>
   )

}

const ViewChar = ({ data }) => {

   const { name, thumbnail, description } = data;

   return (
      <div className="single-comic">
         <Helmet>
            <meta
               name="description"
               content={`${name} description`}
            />
            <title>{`${name} description`}</title>
         </Helmet>
         <img src={thumbnail} alt={name} className="single-comic__img" />
         <div className="single-comic__info">
            <h2 className="single-comic__name">{name}</h2>
            <p className="single-comic__descr">{description}</p>
         </div>
         <Link href="#" className="single-comic__back">Back to all</Link>
      </div>
   )
}

export default SingleComicPage;