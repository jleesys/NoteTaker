import axios from 'axios'

const url = `http://localhost:3001/notes`;

const getAll = () => {
    const request = axios
        .get(url)
        .then(response => response.data)
    return request;
}

const postNew = (newObject) => {
    const request = axios  
        .post(url, newObject)
        .then(response => response.data)
    return request;
}

export default { getAll, postNew }