//const { response } = require("express");

const apiURL = 'http://localhost:3000';
const tableBody = document.getElementById('table-body');
const username = document.getElementById('username');

let users = [];

async function retrieveUsers(){
    const response = await fetch(`${apiURL}/users`);
    return await response.json();
}

async function getUser(id){
    return await fetch(`${apiURL}/users/${id}`);
}

async function displayUsers(){
    users = await retrieveUsers();
    users.forEach( user => {
        tableBody.innerHTML += (
            `<tr>
            <td>${user.id}</td>
            <td>${user.userName}</td>
            <td>
            <button onclick="remove(${user.id})">Eliminar</button>
            <button onclick="update(${user.id})">Editar</button>
            </td>
            `)
    })
}

displayUsers();

async function addNewUser() {
    const bodyObj = {
        id: users.length + 1,
        userName: username.value
    }
    
    const res = await fetch(`${apiURL}/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(bodyObj)
    })

    if(res.ok){
        location.reload()
    } else {
        const error = await res.json();
        alert(error.Message);
    }

    location.reload();
}

async function remove(id) {

    const yesOrNo = prompt(`Do you really want to delete this user? 
    \n1. Yes \n2. No`);
    if(yesOrNo.trim() !== '1') return;

    const response = await fetch(`/users/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    if(response.ok){
        alert('The user was deleted successfully');
    }
    else {
        alert(await response.json());
    }
    location.reload();
}

async function update (id){
    const newUserName = prompt('Please enter the new user name:');
    const user = await (await getUser(id)).json();

    if(newUserName.trim().length <= 0 || newUserName === null) return;
    const res = await fetch(`${apiURL}/users`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userName: user.userName,
            newUserName
        })
    })
    if(res.ok){
        alert(`The user ${user.userName} was updated to ${newUserName}`);
    }
    else {
        const error = await res.json();
        alert(error.Message);
    }
    location.reload();
}

function clean() {
    username.value = '';
}