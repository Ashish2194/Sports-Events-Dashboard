import React from "react";
import './SearchBar.css';

const SearchBar = ({onChange}) => {
    return <div className="searchContainer">
    <form className="nosubmit">
      <input className="nosubmit" type="search" 
      placeholder="Search by event names..." onChange={onChange} />
    </form>
  </div>
}
export default SearchBar;