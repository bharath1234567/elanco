import axios from 'axios';

export const fetchData = async ()=> {
  try {
    const response = await axios.get('https://engineering-task.elancoapps.com/api/raw');
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};