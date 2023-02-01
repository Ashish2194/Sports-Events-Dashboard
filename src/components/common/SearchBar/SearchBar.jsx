import React from "react";
import CONSTANTS from "../../../constants";
import './SearchBar.css';

const SearchBar = ({ onChange }) => {
  return <div className="searchContainer">
    <form className="nosubmit" onSubmit={e => e.preventDefault()}>
      <input className="nosubmit" type="search"
        placeholder={CONSTANTS.SEARCH_PLACEHOLDER} onChange={onChange} />
    </form>
  </div>
}
export default SearchBar;