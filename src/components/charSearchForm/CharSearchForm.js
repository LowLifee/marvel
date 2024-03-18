import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import './charSearchForm.scss';

import useMarvelService from '../../services/MarvelService';

const CharSearchForm = () => {

   const [toPage, setToPage] = useState(false);
   const [error, setError] = useState(false);
   const [charId, setCharId] = useState(null);
   const [char, setChar] = useState(null);
   const [loading, setLoading] = useState(false);

   const { getCharacterByName } = useMarvelService();

   const onCharLoaded = (char) => {
      setChar(char);
   }
   const onSearchFormSubmited = async (name) => {
      setLoading(true);
      await getCharacterByName(name).then(res => {
         if (res) {
            setCharId(res.id)
            setError(false);
            setToPage(true);
            onCharLoaded(res);
            setLoading(false);
         } else {
            setError(true);
            setToPage(false);
            setLoading(false);
         }
      })
   }
   const errorMessage = error ? <div className="char__search-critical-error">Кажется что-то пошло не так.</div> : null;

   const charNotFount = error && !toPage ? <div>{"The character could not have been found"}</div> : null;
   const results = !char ? null : char ? <div className="char__search-wrapper">
      <div className="char__search-success">There is! Visit {char.name} page?</div>
      <Link to={`/characters/${char.id}`} className="button button__secondary">
         <div className="inner">To page</div>
      </Link>
   </div> :
      <div className="char__search-error">
         The character was not found. Check the name and try again
      </div>;

   return (
      <div className="char__search-form">
         <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
         <Formik
            initialValues={{
               name: ''
            }}
            validationSchema={Yup.object({
               name: Yup.string()
                  .min(2, 'Минимум 2 символа для отправки!')
                  .required('Заполните поле!')
            })}
            onSubmit={({ name }) => {
               onSearchFormSubmited(name);
            }}>
            <Form>

               <div className="char__search-wrapper">
                  <Field
                     id="charName"
                     name="name"
                     placeholder="Enter name">
                  </Field>
                  <FormikErrorMessage component="div" className="char__search-error" name="name" />
                  {charNotFount}
                  <button
                     type='submit'
                     className="button button__main"
                     disabled={loading}>
                     <div className="inner">find</div>
                  </button>
               </div>
            </Form>
         </Formik>
         {errorMessage}
         {results}
      </div>
   )
}


export default CharSearchForm;