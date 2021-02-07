import React, { useState } from 'react';
import "../styles/ComponentCSS.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import spinner from '../assets/spinner.gif';
import UserService from '../Service/UserService';

const Search = () => {
  const [searchOccurred, setSearchOccurred] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchValueHandler = (event) => setSearchValue(event.target.value);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const searchHandler = async (event) => {
    event.preventDefault();
    if (searchValue !== '') {
      setLoading(true);
      setSearchOccurred(true);

      await UserService.getSearchResults({ searchValue })
      .then((res) => {
        setResults(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
    } else {
      setSearchOccurred(false);
    }
  }

  return (
    <div className="container align-center">
      <h1 className="m-3">Search</h1>
      <form className="input-group rounded" onSubmit={searchHandler}>
        <input type="search" className="form-control rounded" placeholder="Search" value={searchValue} onChange={searchValueHandler} />
        <button type="submit" className="input-group-text border-0 bg-secondary" id="search-addon">
          <FontAwesomeIcon className="text-white mx-2" icon={faSearch} />
        </button>
      </form>
      <div id="results" className="py-5">
        <ul className="card list-group rounded p-5">
          {
          !loading ?
            results.length > 0 ?
              <>
                <h3 className="p-2">Users</h3>
                {results.map((item, index) => {
                  return (
                    <Link to={`/profile/${item.username}`} className="list-group-item list-group-item-action bg-secondary py-4" key={index}>
                      <p className="text-white m-0">{item.username}</p>
                    </Link>
                  )
                })}
              </>
            :
              searchOccurred ? 
              <h3 className="text-center">No Results Found</h3> 
              : 
              <h3 className="text-center">Enter Something Above to Search</h3>
          :
            <img className="col-sm-2 offset-5" src={spinner} alt="" />
          }
        </ul>
      </div> 
    </div>
  )
}

export default Search;