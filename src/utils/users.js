const users = []
const rooms = []

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // Validating
    if (!room || !username) {
        return {
            error: 'Username and room are required.'
        }
    }
    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    //Validate Username
    if (existingUser) {
        return {
            error: 'Username is in use.'
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    if (!(rooms.includes(room))){
        rooms.push(room)
    }
    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getRooms = () => {
    return rooms
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.toLowerCase())
}


module.exports = {
    getRooms,
    getUser,
    getUsersInRoom,
    removeUser,
    addUser
}

