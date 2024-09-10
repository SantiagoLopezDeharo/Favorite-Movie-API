require('dotenv').config();
const axios = require('axios');

const { getFavMovies, addFavToUser } = require("../repos/MovieRepo");

const apiKey = process.env.api_key;

const listMovies = (req, res) => 
{
    
    const query = req.query.query;
    if (query)
    {
        axios.get(`https://api.themoviedb.org/3/search/keyword`, {
            params: {
                api_key: apiKey,
                query: query
            }
        }
        ).then(response => {
                return res.status(200).json(response.data.results);
            }
        ).catch(error => {
              return res.status(500).json({message:"Internal server error."});
            }
        );
    }
    else
    {
        axios.get(`https://api.themoviedb.org/3/discover/movie`, {
            params: {
                api_key: apiKey,
            }
        }
        ).then(response => {
                return res.status(200).json(response.data.results);
            }
        ).catch(error => {
              return res.status(500).json({message:"Internal server error."});
            }
        );
    }

}

const addToFav = (req, res) =>
{
    const usrEmail = req.user.username;
    const movieId = req.body.movieId;

    if (!movieId && !(movieId instanceof int)) return res.status(403).json({message:"Movie Id missing or invalid"})

    addFavToUser(usrEmail, movieId, (err) =>
    {
        if (err) return res.status(500).json({message:"Internal server error."});

        return res.status(200).json({message:"Movies added to favorites of the user with email: " + usrEmail})
    });
}

// Function to fetch movie data by ID
const fetchMovieData = async (id) => {
    try 
    {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: {
          api_key: apiKey
        }
      });
      return response.data;
    } 
    catch (error) 
    {
      console.error(`Error fetching data for movie ID ${id}:`, error);
      return null;
    }
  };

const listFav = (req, res) =>
{
    const usrEmail = req.user.username;


    getFavMovies(usrEmail, async (err, favs)=>
    {
        if (err) return res.status(500).json({message:"Internal server error."});

        let movieIds = [];

        for (let i = 0; i < favs.length ; i++) movieIds.push(favs[i].movieId);


        const requests = movieIds.map(id => fetchMovieData(id));
        let moviesData = await Promise.all(requests); // We send all the requests in parallel
        moviesData = moviesData.filter(data => data !== null); // Filter out any null results

        return res.status(200).json(moviesData);
    });
}

module.exports = { listMovies, addToFav, listFav };