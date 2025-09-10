import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios';
import { useGlobalContext } from '../context/global';
import LoginModal from './LoginModal';


function AnimeItem() {

    const [modalOpen, setModalOpen] = useState(false);
    const { user, logout } = useGlobalContext();

    const {id} = useParams()

    const [anime, setAnime] = React.useState({})
    const [showMore, setShowMore] = React.useState(false)

    const [new_anime, setNewAnime] = React.useState(() => {
    return {
        mal_id: id,
        status: "Planning",
        username: user ? user.username : null  // add username if logged in
    }
    });

    


    React.useEffect(() => {
    if (user) {
        setNewAnime(prev => ({
            ...prev,
            username: user.username
        }));
    }
}, [user]);


    const {
        title,
        synopsis,
        trailer,
        duration,
        aired,
        season,
        images,
        rank,
        score,
        scored_by,
        popularity,
        status,
        rating,
        source} = anime

    const getAnime = async (animeId) => {
  try {
    // Try fetching from Jikan API
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    if (!response.ok) throw new Error('API fetch failed');
    const data = await response.json();
    
    setAnime(data.data);
    console.log("Anime fetched from API:", data.data.mal_id);

    // Save to cache
    const animeToSave = {
      mal_id: data.data.mal_id,
      status: data.data.status || "Unknown",
      title: data.data.title,
      synopsis: data.data.synopsis,
      duration: data.data.duration,
      aired: data.data.aired?.string,
      season: data.data.season,
      image_url: data.data.images?.jpg.large_image_url,
      rank: data.data.rank,
      score: data.data.score,
      scored_by: data.data.scored_by,
      popularity: data.data.popularity,
      rating: data.data.rating,
      source: data.data.source
    };

    await axios.post("http://localhost:3001/api/anime/cache", animeToSave);
    console.log("Anime saved to cache:", animeToSave.mal_id);

  } catch (err) {
    console.warn("API fetch failed, trying cache...", err.message);

    try {
      // Fetch from local anime_cache DB
      const res = await axios.get(`http://localhost:3001/api/anime/cache/${animeId}`);
      if (res.data.data) {
        setAnime(res.data.data);
        console.log("Anime loaded from cache:", res.data.data.mal_id);
      } else {
        console.error("Anime not found in cache");
      }
    } catch (cacheErr) {
      console.error("Error fetching anime from cache:", cacheErr);
    }
  }
};


    useEffect(() => {
        getAnime(id)
    }, [])

    // Handle input changes
    //const handleChange = (e) => {
    //    setNewAnime({ ...new_anime, [e.target.name ]: e.target.value });
    //};

    // Event handler for the button click
    const handleClick = () => {
        
        if (!user) {
            // If not logged in, show modal
            setModalOpen(true);
            return;
        }
        
        if (new_anime.mal_id === undefined || new_anime.status === undefined) {
            alert('MAL ID and Status are required.');
            return;
        }

        const animeToAdd = {
        ...new_anime,
        username: user.username
        };

        console.log("Current user:", user);
        console.log("Username being sent:", user.username);
        console.log("Data sent to backend:", animeToAdd);

        axios.post('http://localhost:3001/api/anime', animeToAdd)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error adding anime:', error.response ? error.response.data : error.message);
            });
    };
    
    return (
        <AnimeItemStyled>

            <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />


            <div className="header">
                <Link to="/profile" className="profile-button">
                    Profile
                </Link>

                {user ? (
                    <Link to="#" className="profile-button" onClick={logout}>
                        Logout ({user.username})
                    </Link>
                ) : (
                    <Link to="#" className="profile-button" onClick={() => setModalOpen(true)}>
                        Login / Register
                    </Link>
                )}
            </div>
            <div className="back">
                <Link to="/">
                    <i className="fas fa-arrow-left" />
                    Home
                </Link>
            </div>

            <div>
                <h1>{title}</h1>
                <button onClick={handleClick} className="add-btn">
                    <i className="fas fa-plus"></i>
                </button>
            </div>

            <div className="details">
                <div className="detail">
                    <div className="image">
                        <img src={images?.jpg.large_image_url} alt="" />
                    </div>
                    <div className="anime-details">

                        <p><span>Aired:</span><span>{aired?.string}</span></p>
                        <p><span>Rating:</span><span>{rating}</span></p>
                        <p><span>Rank:</span><span>{rank}</span></p>
                        <p><span>Score:</span><span>{score}</span></p>
                        <p><span>Popularity:</span><span>{popularity}</span></p>
                        <p><span>Status:</span><span>{status}</span></p>
                        <p><span>Source:</span><span>{source}</span></p>
                        <p><span>Season:</span><span>{season}</span></p>
                        <p><span>Duration:</span><span>{duration}</span></p>
                    </div>
                </div>
                <p className="description" style={{ whiteSpace: 'pre-wrap' }}>
                    {showMore ? synopsis + '\r\n' : synopsis?.substring(0, 400) + '...' + '\r\n'}
                    <button onClick={() => {
                        setShowMore(!showMore)
                    }}>{showMore ? "Show less": "Read more"}</button>
                </p>
            </div>
            <h3 className="title">Trailer</h3>
            <div className="trailer-con">
                {trailer?.embed_url ?
                    <iframe
                        src={`${trailer?.embed_url}?autoplay=0`}
                        title={title}
                        width="800"
                        height="450"
                        allowFullScreen>
                    </iframe>
                    :
                    <h3>Trailer not available</h3>
                }
            </div>
        </AnimeItemStyled>
    )
}

const AnimeItemStyled = styled.div`
    padding: 3rem 15%;
    background-color: #EDEDED;
    
    .header {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .profile-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .profile-button:hover {
        background-color: #0056b3;
    }

    .back{
        position: absolute;
        top: 2rem;
        left: 2rem;
        a{
            font-weight: 600;
            text-decoration: none;
            color: #EB5757;
            display: flex;
            align-items: center;
            gap: .5rem;
        }
    }

    h1{
        display: inline-block;
        font-size: 3rem;
        margin-bottom: 1.5rem;
        cursor: pointer;
        padding-right: 1rem;
        &:hover{
            transform: skew(-3deg);
        }
    }
    
    .add-btn {
        color: #6c7983; 
        font-size: 2.5rem;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        align-items: center;
        justify-content: center;
    }
    
    .title{
        display: inline-block;
        margin: 3rem 0;
        font-size: 2rem;
        cursor: pointer;
    }
    
    .description{
        margin-top: 2rem;
        color: #6c7983;
        line-height: 1.7rem;
        button{
            background-color: transparent;
            border: none;
            outline: none;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: 600;
        }
    }
    
    .details{
        background-color: #ffff;
        border-radius: 20px;
        padding: 2rem;
        border: 5px solid #e5e7eb;
        
        .detail{
            display: grid;
            grid-template-columns: repeat(2, 1fr);

            img{
                border-radius: 7px;
                max-width: 400px;
                width: 100%;
            }
        }
        
        .image{
            display: flex;
            justify-content: center;         /* Center horizontally */
            align-items: center;             /* Center vertically */
            margin: 1rem;
        }
        
        .anime-details{
            margin: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            p{
            margin-left: 2rem;
                display: flex;
                gap: 1rem;
            }
            p span:first-child{
                font-weight: 600;
                color: #6c7983;
            }
        }
    }

    .trailer-con{
        display: flex;
        justify-content: center;
        align-items: center;
        iframe{
            outline: none;
            border: 5px solid #e5e7eb;
            padding: 1.5rem;
            border-radius: 10px;
            background-color: #ffffff;    
        }
    }
    
    @media (max-width: 1200px) {
        .details .detail{
            display: block;
        }
        .image {
            text-align: center;
        }
    }
    @media (max-width: 1000px) {
        padding: 3rem 10%;
    }
    @media (max-width: 800px) {
        padding: 3rem 5%;
    }
`;

export default AnimeItem