
import Popular from './Popular';
import Upcoming from './Upcoming';
import Airing from './Airing';
//import { renderToReadableStream } from 'react-dom/server'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../context/global';
import styled from 'styled-components'
import React, { useState } from 'react';
import LoginModal from './LoginModal';

function Homepage() {
    const {
        handleSubmit,
        search,
        searchAnime,
        handleChange,
        getUpcomingAnime,
        getAiringAnime,
    } = useGlobalContext()

    const [rendered, setRendered] = React.useState('popular')
    const [modalOpen, setModalOpen] = useState(false);
    const { user, logout } = useGlobalContext(); // if using Option 1


    const switchComponent = () => {
        switch(rendered){
            case 'popular':
                return <Popular rendered={rendered} />
            case 'airing':
                return <Airing rendered={rendered} />
            case 'upcoming':
                return <Upcoming rendered={rendered} />
            default:
                return <Popular rendered={rendered} />
        }
    }
    return (
        <HomepageStyled>

{/* Login Modal */}
            <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            <header>
                <div className="header">
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="profile-button"
                        >
                            Admin Panel
                        </Link>
                    )}
                    
                    <Link
                        to={user ? "/profile" : "#"} // only navigate if logged in
                        className="profile-button"
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault(); // prevent navigation
                                setModalOpen(true); // open login modal
                            }
                        }}
                    >
                        WatchList
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
                <div className="logo">
                    <h1>
                        {rendered === "popular" ? "Popular Anime" :
                        rendered === "airing" ? "Airing Anime" : "Upcoming Anime"}
                    </h1>
                </div>
                <div className="search-container">
                    <form action="" className="search-form">
                        <div className="input-control">
                            <input type="text" placeholder="Search Anime" value={search} onChange={handleChange} />
                            <button type="submit" onClick={handleSubmit}>Search</button>
                        </div>
                    </form>
                    
                    <div className="filter-btn popular-filter">
                        <button onClick={() => {
                            setRendered('popular')
                        }}>Popular<i className="fas fa-fire"></i></button>
                    </div>
                    <div className="filter-btn airing-filter">
                        <button onClick={() => {
                            setRendered('airing')
                            getAiringAnime()
                        }}>Airing</button>
                    </div>
                    <div className="filter-btn upcoming-filter">
                        <button onClick={() => {
                            setRendered('upcoming')
                            getUpcomingAnime()
                        }}>Upcoming</button>
                    </div>
                </div>
            </header>
            {switchComponent()}
        </HomepageStyled>
    )
}

const HomepageStyled = styled.div`      
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

    .login-button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .login-button:hover {
        background-color: #0056b3;
    }

    header{
        padding: 2rem 5rem;
        width: 60%;
        margin: 0 auto;
        transition: all .4s ease-in-out;
        
        .logo{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 2rem;
            margin-bottom: 2rem;
        }

        .search-container{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;

            button{
                display: flex;
                align-items: center;
                gap: .5rem;
                padding: .7rem 1.5rem;  
                outline: none;
                border-radius: 30px;
                font-size: 1.2rem;
                background-color: #ffffff;
                cursor: pointer;
                transition: all .4s ease-in-out;
                font-family: inherit;
                border: 5px solid #e5e7eb;
                width: 150px;
                justify-content: center;
            }

            form{

                position: relative;
                width: 100%;

                .input-control{
                    display: flex;
                    position: relative;
                    transition: all .4s ease-in-out;
                }

                .input-control input{
                    flex: 9;
                    padding:.7rem 1rem;
                    border: none;
                    outline: none;
                    border-top-left-radius: 30px;
                    border-bottom-left-radius: 30px;
                    font-size: 1.2rem;
                    background-color: #ffffff;
                    border: 5px solid #e5e7eb;
                    border-right: 0;
                    transition: all .4s ease-in-out;
                }

                .input-control button{
                    flex: 1;
                    max-width: 130px;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                }
            }
        }

        @media (max-width: 1530px) {
            padding: 1rem 0rem;
            width: 95%;
        }

        @media (max-width: 900px) {
            .search-container {
                display: block;
                form{
                .input-control{
                    display: block;
                    margin-bottom: 1.5rem;
                    input{
                        width: 100%;
                        border-radius: 30px;
                    }
                    button{
                        max-width: 150px;
                        border-top-left-radius: 30px;
                        border-bottom-left-radius: 30px;
                    }
                }
            }
        }
    }
`

export default Homepage