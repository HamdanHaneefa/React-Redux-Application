import axios from 'axios'


function getData() {
  return axios.get('http://localhost:3000/data'); 
}

export default getData