import { useState, useCallback } from "react";

export const useHttp = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);

   const request = useCallback(async (url, method = "POST", body = null, headers = { "Content-Type": "application/json" }) => {

      setLoading(true);

      try {
         const res = await fetch(url);

         if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
         }

         const data = await res.json();

         setLoading(false);
         return data;

      } catch (e) {
         setLoading(false);
         setError(true);
         throw e;
      }
   }, []);

   const clearError = useCallback(() => {
      setError(false)
   }, []);

   return { loading, error, clearError, request }
}