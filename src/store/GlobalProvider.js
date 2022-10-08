import React, { createContext, useState, useRef } from 'react'

const GlobalContext = createContext();
const mainUrl = "https://api.unsplash.com/photos/"
const searchUrl = "https://api.unsplash.com/search/photos/"



const GlobalProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [query, setQuery] = useState('');
    const [perPage, setPerPage] = useState(1)
    const [isRequestScroll, setIsRequestScroll] = useState(false)
    return <GlobalContext.Provider value={{
        loading, photos, query, perPage, isRequestScroll,
        setLoading, setPhotos, setQuery, setPerPage, setIsRequestScroll
    }}>
        {children}
    </GlobalContext.Provider>
}

export default GlobalProvider
export { GlobalContext }

export { mainUrl, searchUrl };