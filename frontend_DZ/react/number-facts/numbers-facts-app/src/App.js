import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import FactList from './components/FactList';
import Pagination from './components/Pagination';
import './styles/App.css';

const API_URL = 'http://numbersapi.com';

const getFacts = async (start, end) => {
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const requests = numbers.map(number => axios.get(`${API_URL}/${number}`));
  const responses = await Promise.all(requests);
  return responses.map(response => response.data);
};

const extractNumber = fact => {
  const match = fact.match(/^\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

function App() {
  const [facts, setFacts] = useState([]);
  const [filteredFacts, setFilteredFacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [factsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const loadFacts = async () => {
      const storedFacts = localStorage.getItem('facts');
      if (storedFacts) {
        setFacts(JSON.parse(storedFacts));
      } else {
        const newFacts = await getFacts(1, 10);
        setFacts(newFacts);
        localStorage.setItem('facts', JSON.stringify(newFacts));
      }
    };
    loadFacts();
  }, []);

  useEffect(() => {
    const filtered = facts.filter(fact =>
      fact.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacts(filtered);
  }, [facts, searchQuery]);

  const handleSearch = query => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleLoadMore = async () => {
    const nextStart = facts.length + 1;
    const nextEnd = nextStart + 9;
    const newFacts = await getFacts(nextStart, nextEnd);
    const updatedFacts = [...facts, ...newFacts];
    setFacts(updatedFacts);
    localStorage.setItem('facts', JSON.stringify(updatedFacts));
  };

  const handleSort = () => {
    const sorted = [...filteredFacts].sort((a, b) => {
      const numA = extractNumber(a);
      const numB = extractNumber(b);
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });
    setFilteredFacts(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const indexOfLastFact = currentPage * factsPerPage;
  const indexOfFirstFact = indexOfLastFact - factsPerPage;
  const currentFacts = filteredFacts.slice(indexOfFirstFact, indexOfLastFact);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Приложение "Факты о числах"</h1>
      <SearchBar onSearch={handleSearch} />
      <button
        onClick={handleSort}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Сортировать {sortOrder === 'asc' ? 'по убыванию' : 'по возрастанию'}
      </button>
      <FactList facts={currentFacts} />
      <Pagination
        factsPerPage={factsPerPage}
        totalFacts={filteredFacts.length}
        paginate={paginate}
      />
      <button
        onClick={handleLoadMore}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Загрузить еще
      </button>
    </div>
  );
}

export default App;