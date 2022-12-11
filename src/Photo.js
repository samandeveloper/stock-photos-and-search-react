//each photo on the homepage
import React from 'react'

const Photo = ({
  urls:{regular},
  alt_description,
  likes,
  user:{
    name,
    portfolio_url,
    profile_image: {medium} //medium should be in {}
  }
}) => {
  return(
    <article className='photo'>
       {/* we can just write regular not the urls below */}
      <img src={regular} alt={alt_description}/>
      <div className='photo-info'>
        <div>
          <h4>{name}</h4>
          <p>{likes} likes</p>
        </div>
        <a href={portfolio_url}>
          {/* we can just write medium not the profile_image below */}
          <img src={medium} className="user-img"/>
        </a>
      </div>
    </article>
  )
}

export default Photo
