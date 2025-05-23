import axios from 'axios';

const API_URL = 'http://numbersapi.com';

export const getFacts = async (start, end) => {
  try {
    const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const requests = numbers.map(number => axios.get(`${API_URL}/${number}`));
    const responses = await Promise.all(requests);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Ошибка при загрузке:', error);
    throw error;
  }
};