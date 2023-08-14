import { useState, useMemo } from "react";
import { FormRow, FormRowSelect } from "./index";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";

export default function SearchContainer() {
  const {
    isLoading,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();
  const [localSearch, setLocalSeach] = useState("");

  // Immidiate search on change
  function handleSearch(e) {
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  }

  const debounce = () => {
    let timeoutId;
    return (e) => {
      setLocalSeach(e.target.value);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 1000);
    };
  };

  // Handle clear submit button
  function handleSubmit(e) {
    e.preventDefault();
    setLocalSeach("");
    clearFilters();
  }

  const optimizedDebounce = useMemo(
    () => debounce(),
    // eslint-disable-next-line
    []
  );

  return (
    <Wrapper>
      <form className="form">
        <h4>Search form</h4>
        {/* Form */}
        <div className="form-center">
          {/* Search Position */}
          <FormRow
            type="text"
            name="search"
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          {/* Search by Status */}
          <FormRowSelect
            labelText="job status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          {/* Search by JobType */}
          <FormRowSelect
            labelText="job type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          {/* Sorting */}
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
}
