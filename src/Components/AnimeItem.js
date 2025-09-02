import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios';

function AnimeItem() {
    const {id} = useParams()

    const [anime, setAnime] = React.useState({})
    const [showMore, setShowMore] = React.useState(false)

    const [new_anime, setNewAnime] = React.useState({
        mal_id: id,
        status: "Planning   "
    });

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

    const getAnime = async(anime) => {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${anime}`)
        const data = await response.json()
        setAnime(data.data)
    }

    useEffect(() => {
        getAnime(id)
    }, [])

    // Handle input changes
    //const handleChange = (e) => {
    //    setNewAnime({ ...new_anime, [e.target.name ]: e.target.value });
    //};

    // Event handler for the button click
    const handleClick = () => {
        if (new_anime.mal_id === undefined || new_anime.status === undefined) {
            alert('MAL ID and Status are required.');
            return;
        }

        axios.post('https://web-server-production-511d.up.railway.app/api/anime', new_anime)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error adding anime:', error.response ? error.response.data : error.message);
            });
    };
    
    return (
        <AnimeItemStyled>
            <div className="header">
                <Link to="/profile" className="profile-button">
                    Profile
                </Link>
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