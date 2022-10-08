import { useEffect, useContext } from "react";
import { BsSearch } from "react-icons/bs";
import { mainUrl, searchUrl } from "./store/GlobalProvider";
import axios from "axios";
import { GlobalContext } from "./store/GlobalProvider";
import Photo from "./Photo";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`

function App() {
  const { photos, loading, query, perPage, isRequestScroll,
    setPhotos, setLoading, setQuery, setPerPage, setIsRequestScroll } = useContext(GlobalContext);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${perPage}`
    const urlQuery = `&query=${query}`
    // nếu có query bên trong search form 
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    }
    // nếu không có query
    else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await axios.get(url);
      const { data } = response;

      setPhotos((oldPhotos) => {
        // nếu có query và parPage hiện tại là 1
        if (query && perPage === 1) {
          return data.results
        }
        // có query không thôi, perPage hiện tại khác 1, tức là
        // fetchImage query rồi, giờ đang kéo xuống để lấy thêm img
        else if (query) {
          const { results } = data;
          return [...oldPhotos, ...results]
        }
        // nếu không có query
        else {
          return ([...oldPhotos, ...data])
        }
      })
      // khi fetch xong rồi, nó set lại loading = false
      setLoading(false);
      // mỗi khi fetch thành công xong, nó lại sửa biến newPhotos = false
      setIsRequestScroll(false);
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }


  // khi mounted, nó fetch lấy img 
  // nếu perPage thay đổi nó gọi fetchImages lại
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [perPage])



  useEffect(() => {
    // nếu nó đang loading, tức là đang fetch 
    // nó set perPage + 1
    if (!loading) {
      setPerPage((oldPerPage) => {
        return oldPerPage + 1;
      })
    }
    if (!isRequestScroll) return;
    // newPhotos = false 
    // mỗi khi scroll, nó set lại newPhotos = true
    // khi thấy newPhotos = true, nó sẽ gọi useEffect một lần
    // sau đó nó set lại perPage + 1 
    // từ đó thấy perPage thay đổi, nó gọi lại fetch một lần
    // sau đó lại setNewPhotos = false 
    // scroll lại set về true, sau đó lại tăng perPage => lại fetch 
  }, [isRequestScroll])

  const scrollEvent = () => {
    if (window.scrollY + window.innerHeight > document.body.scrollHeight - 2) {
      setIsRequestScroll(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    // Nếu không có query thì sẽ không làm gì cả
    if (!query) {
      return;
    }
    // nếu có query hiện tại đang là 1 thì nó sẽ cho phép fetch 
    if (perPage === 1) {
      fetchImages();
      return;
    }
    // mỗi khi submit query là nó lại set perPage lại về 1
    setPerPage(1);
  }

  // nếu loading chuyển thành false, tức là fetch thành công
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text" placeholder="search" className="form-input" value={query} onChange={(e) => {
            setQuery(e.target.value)
          }} />
          <button onClick={handleSubmit} type="submit" className="submit-btn">
            <BsSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  )
}

export default App;
