import axios from "axios"
import {mainUrl} from './store/GlobalProvider'
import { useState, useEffect } from "react";

const useAxios = (url) =>{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
    const [query, setQuery] = useState('')
    
    const fetchImages = async () =>{
        try {
            const response = await axios.get(url)
            const data = response.data;
            setLoading(false);
            setData(data);
        }
        catch(error){
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchImages()
    }, [])

    return {
        loading, data
    }
}
export default useAxios;