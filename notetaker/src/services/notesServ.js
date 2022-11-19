import axios from 'axios'

const url = `http://localhost:3001/api/notes`;

const getAll = () => {
    console.log(`getting all`)
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

const putUpdate = (newObject, id) => {
    console.log(`creating put update for id ${id}`)
    const request = axios
        .put(`${url}/${id}`, newObject)
        .then(response => response.data);
    console.log(`id ${id} has been putted :)`)
    return request;
}

const remove = (id) => {
    console.log(`removing object id ${id}`)
    const request = axios
        .delete(`${url}/${id}`)
    return request;
}
export default { getAll, postNew, putUpdate, remove }