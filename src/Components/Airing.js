import React from 'react'
import { useGlobalContext } from '../context/global'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

function Airing({rendered}) {
  const {airingAnime, isSearch, searchResults} = useGlobalContext()

  const conditionalRender = () => {
    if(!isSearch && rendered === 'airing') {
      return airingAnime?.map((anime) => {
        return <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
          <img src={anime.images.jpg.large_image_url} alt="" />
        </Link>
      })
    }
    else {
      return searchResults?.map((anime) => {
        return <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
          <img src={anime.images.jpg.large_image_url} alt="" />
        </Link>
      })
    }
  }

  return (
    <PopularStyled>
      <div className="airing-anime">
        {conditionalRender()}
      </div>
    </PopularStyled>
  )
}

const PopularStyled = styled.div`
  display: flex;
  margin-left:  5rem;
  margin-right: 5rem;
  .airing-anime{
    margin-top: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 5rem;
    padding-right: 5rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 2rem;
    background-color: #ffffff;
    border-top: 5px solid #e5e7eb;
    
    a{
      height: 500px;
      border-radius: 7px;
      border: 5px solid #e5e7eb;
    }
    a img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px; 
    }
  }

  @media (max-width: 600px) {
    margin-left:  1rem;
    margin-right: 1rem;
    
    .airing-anime {
      padding-left: 1rem;
      padding-right: 1rem;
      display: block;

      a{
        width: 100%;
        height: auto;
      }
    
      a img{
        height: auto; /* Maintain aspect ratio */
        max-height: none; /* Remove max-height constraint */
      }
    }
  }
`;

export default Airing