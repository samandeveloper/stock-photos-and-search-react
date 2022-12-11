//this project can have two states: 
//1. when srolling down and images uploading constantly 
//2. when search uses and using search gives us the images
//if the search keyword is any part of the data it will show that image

import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'

const clientID =  `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
//the two url below are not the final urls
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  //states
  const[loading,setLoading] = useState(true)
  const[photos,setPhotos] = useState([])
  const[page,setPage] = useState(1)  //by default we are on page one
  const[query,setQuery] = useState('')  //query is for search
  const[newImage,setNewimage] = useState(false)   //when scrolling to see the new images

  //fetch data from api
  const fetchImages = async() =>{
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`

    //if we want the link with or without search (query)
    if(query){  //we have the query (search) in the link
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    }else{   //we don't have query in the link
      url = `${mainUrl}${clientID}${urlPage}`
    }
    console.log(url)
    try{
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)

      setPhotos((oldPhotos)=>{
        if(query && page === 1){  //query exists and we are on page one
          return data.results  //results is an array of objects
        }else 
        if(query){      //query exists and we are not on page one keep the old pages and upload new pages
          return[...oldPhotos,...data.results]
        }else{        //query doesn't exist--we are using mainUrl--on mainUrl we don't have result array of objects, we have data array of objects
          return[...oldPhotos,...data]
        }
      })
      setLoading(false)
      setNewimage(false)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchImages();
  },[page])   //when uploading each page we should call the fetchImage function again
  

  //go to the next page--this part let us to scroll and see the new images
  useEffect(()=>{
    setPage((oldPage)=>{
      return oldPage+1
    })
  },[newImage])
  
  //function for scroll
  const event = () =>{
    if(window.innerHeight+window.scrollY >= document.body.scrollHeight-2){   //means if we reachs to the end of the page and -2 means we are close to the end
      setNewimage(true)   //after scroll, upload the new images
    }
  }

  useEffect(()=>{
    window.addEventListener('scroll',event);
    //
  },[])

  //handle clicking on the search icon button--note that we don't need to filter any image after search since the url that has the query do this
  const handleSubmit = (e) =>{
    e.preventDefault()
    if(!query){   //if there is no search then do nothing
      return
    }if(query){
      console.log("query exists")
      fetchImages()  //call the api function
    }
    setPage(1)   //we must be on page one when we click on the search icon
  }

  //handle on change when typing in the search input
  const handleChange = (e)=>{
    return setQuery(e.target.value)
  }

  return (
    <main>
      <section className='search'>
        <form className='search-form'>
          <input type='text' placeholder='search' value={query} className='form-input' onChange={handleChange}/>
          <button type='submit' className='submit-btn' onClick={handleSubmit}><FaSearch /></button>
        </form>
      </section>

      <section className='photos'>
        <div className='photos-center'>
          {photos.map((photo,index)=>{
            return <Photo key={index} {...photo}/>
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  )
}

export default App
