import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios';

function Profile() {
    const [animeList, setAnimeList] = useState([]);
    const [animeDetails, setAnimeDetails] = useState({});

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                const response = await axios.get('https://web-server-production-511d.up.railway.app/api/anime');
                setAnimeList(response.data.data);
                
                const detailsPromises = response.data.data.map(anime => 
                    axios.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}`)
                        .then(detailResponse => ({
                            id: anime.mal_id,
                            ...detailResponse.data.data
                        }))
                );

                const fetchedDetails = await Promise.all(detailsPromises);
                
                const detailsObject = fetchedDetails.reduce((acc, detail) => {
                    acc[detail.id] = detail;
                    return acc;
                }, {});

                setAnimeDetails(detailsObject);
            } catch (error) {
                console.error('Error fetching anime list:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('Request data:', error.request);
                }
            }
        };

        fetchAnimeList();
    }, []);

    const handleStatusChange = async (animeId, newStatus) => {
        try {
            await axios.put(`https://web-server-production-511d.up.railway.app/api/anime/${animeId}`, { status: newStatus });
            // Update the local state with the new status
            setAnimeList(prevAnimeList =>
                prevAnimeList.map(anime =>
                    anime.id === animeId ? { ...anime, status: newStatus } : anime
                )
            );
        } catch (error) {
            console.error('Error updating anime status:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('Request data:', error.request);
            }
        }
    };

    const handleDelete = async (animeId) => {
        try {
            await axios.delete(`https://web-server-production-511d.up.railway.app/api/anime/${animeId}`);
            setAnimeList(prevAnimeList => prevAnimeList.filter(anime => anime.id !== animeId));
        } catch (error) {
            console.error('Error deleting anime:', error);
        }
    };

    return (
        <ProfileStyled>
            <div className="back">
                <Link to="/">
                    <i className="fas fa-arrow-left" />
                    Home
                </Link>
            </div>
            <h1>Username</h1>

            <div className="anime-list">    
                {animeList.map((anime) => (  
                    <div className="anime-item" key={anime.id}>
                        <img src={animeDetails[anime.mal_id]?.images.jpg.large_image_url} alt="" />
                        <Link to={`/anime/${anime.mal_id}`} className="anime-title" key={anime.mal_id}>
                            <span className="anime-title">{animeDetails[anime.mal_id]?.title}</span>    
                        </Link>
                        <select 
                            className="anime-dropdown" 
                            value={anime.status}
                            onChange={(e) => handleStatusChange(anime.id, e.target.value)}
                        >
                            <option value="Planning">Planning</option>
                            <option value="Watching">Watching</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button className="delete-button" onClick={() => handleDelete(anime.id)}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>
        </ProfileStyled>
    )
}

const ProfileStyled = styled.div`
    padding: 3rem 15%;
    background-color: #EDEDED;
    
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
        &:hover{
            transform: skew(-3deg);
        }
    }
    
    .title{
        display: inline-block;
        margin: 3rem 0;
        font-size: 2rem;
        cursor: pointer;
    }
        
    .delete-button {
        color: red;
        border: none;
        outline: none;
        margin-left: 0.5rem;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 5px;
        font-size: 1.5rem;
        cursor: pointer;
    }
    .anime-list{
        background-color: #ffff;
        border-radius: 20px;
        padding: 2rem;
        border: 5px solid #e5e7eb;
        

        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px; /* Space between anime-items */
        
        .anime-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 8px;

            .anime-title {
                color: #6c7983;
                font-weight: bold;
                font-size: 1.25rem;
                padding-left: 1rem;
                &:hover{
                    transform: skew(-3deg);
                }
            }
            .status-select {
                justify-contents: right;
            }   
            img{
                border-radius: 7px;
                max-width: 50px;
                max-height: 50px;
                width: 100%;
                object-fit: cover
            }
        }

        .anime-dropdown {
            margin-left: auto;
            padding: 5px;
        }

        .image{
            margin: 1rem;
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

export default Profile