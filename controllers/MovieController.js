require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.api_key;

const listMovies = (req, res) => 
{
    
    const query = req.query.query;
    axios.get(`https://api.themoviedb.org/3/search/keyword`, {
        params: {
            api_key: apiKey,
            query: query
        }
    }
    ).then(response => {
            console.log(response.data.results);
            return res.status(200).json(response.data.results);
        }
    ).catch(error => {
          return res.status(500).json({message:"Internal server error."});
        }
    );

}

module.exports = { listMovies };