import React, { useContext, useReducer } from "react";

const GlobalContext = React.createContext();

const baseUrl = "https://api.jikan.moe/v4"

const LOADING            = "LOADING";
const SEARCH             = "SEARCH";
const GET_POPULAR_ANIME  = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_AIRING_ANIME   = "GET_AIRING_ANIME";

const reducer = (state, action) => {
    switch(action.type){
        case LOADING:
            return {...state, loading:true}
        case GET_POPULAR_ANIME:
            return {...state, popularAnime: action.payload, loading: false}
        case SEARCH:
            return {...state, searchResults: action.payload, loading: false}
        case GET_UPCOMING_ANIME:
            return {...state, upcomingAnime: action.payload, loading: false}
        case GET_AIRING_ANIME:
            return {...state, airingAnime: action.payload, loading: false}
        default:
            return state;
    }
    return state;
}

export const GlobalContextProvider = ({children}) => {
    const initialState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        pictures: [],
        isSearch: false,
        searchResults: [],
        loading: false,
        user: null,
    }

////////////
    


////////////

    const [state, dispatch] = useReducer(reducer, initialState);
    const [search, setSearch] = React.useState('')

    const handleChange = (e) => {
        setSearch(e.target.value);
        if (e.target.value === ''){
            state.isSearch = false;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (search) {
            searchAnime(search);
            state.isSearch = true;
        }
        else {
            state.isSearch = false;
            alert('Please enter a search term')
        }
    }
    const getPopularAnime = async () => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
        const data = await response.json();
        console.log("First anime loaded:", data.data[0]);
        dispatch({type: GET_POPULAR_ANIME, payload: data.data})
        
    }

    const getUpcomingAnime = async () => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
        const data = await response.json();
        dispatch({type: GET_UPCOMING_ANIME, payload: data.data})
    }

    const getAiringAnime = async () => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
        const data = await response.json();
        dispatch({type: GET_AIRING_ANIME, payload: data.data})
    }

    const searchAnime = async (anime) => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/anime?q=${anime}&anime_search_query_orderby=popularity&sort=desc&sfw`)
        const data = await response.json();
        dispatch({type: SEARCH, payload: data.data})
    }

////////////////////////////
const [token, setToken] = React.useState(() => {
    return localStorage.getItem('token') || null;
});

// manage user state
const [user, setUser] = React.useState(() => {
    const token = localStorage.getItem('token');
    if(token){
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    }
    return null;
});

const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);

    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
    setUser(payload); // payload should have username, role
}

const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
}








//////////////////////////////
    React.useEffect(() => {
        getPopularAnime();
    }, [])

    return(
        <GlobalContext.Provider value={{
            ...state,
            handleChange,
            handleSubmit,
            searchAnime,
            search,
            getPopularAnime,
            getUpcomingAnime,
            getAiringAnime,
            user,
            token,       
            login,      
            logout
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
}