import axios from 'axios'

// DEV URL
const url = `http://localhost:3001/api/notes`;

// PROD URL
// const url = `https://bittersurf-420.fly.dev/api/notes`;

const getAll = () => {
    console.log(`getting all`)
    const request = axios
        .get(url)
        .then(response => response.data)
        .catch(err => {
            console.log('Failed to get notes... Try refreshing.')
        })
    return request;
}

const postNew = (newObject) => {
    const request = axios
        .post(url, newObject)
        .then(response => {
            return response.data
        })
        .catch(err => console.log(`error posting: `, err))
    return request;
}

const putUpdate = (newObject, id) => {
    console.log(`creating put update for id ${id}`)
    const request = axios
        .put(`${url}/${id}`, newObject)
        .then(response => response.data)
        .catch(err => {
            console.log('failed to update note...');
        })
    console.log(`id ${id} has been putted :)`)
    return request;
}

const remove = (id) => {
    console.log(`removing object id ${id}`)
    const request = axios
        .delete(`${url}/${id}`)
        .catch(err => {
            console.log('error deleting note...')
        })
    return request;
}
export default { getAll, postNew, putUpdate, remove }