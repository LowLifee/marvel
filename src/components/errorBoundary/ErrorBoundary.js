import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

// boundary ловит ошибки только в 3 случаях: 1. ошибки в жизненных циклов. 2. рендерные ошыбки. 3. и в стейте (точно не помню)

class ErrorBoundary extends Component {
   state = {
      error: false
   }

   componentDidCatch(err, errorInfo) {
      //console.log(error, errorInfo)  можно отправить на сервер и т.д.

      this.setState({ error: true })
   }

   // было еще один способ только не отправляет эррор и эрроринфо, но забыл что-то вроде static getDerivedStateFromError(error)

   //static getDerivedStateFromError(error) {
   //   this.setState({ error: true })
   //}

   render() {
      if (this.state.error) {
         return <ErrorMessage />;
      }

      return this.props.children;
   }
}

export default ErrorBoundary;