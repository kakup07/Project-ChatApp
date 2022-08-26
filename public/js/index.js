const $rooms = document.querySelector('.rooms')

fetch('http://localhost:3000/api/rooms')
    .then((res) => res.json())
    .then((data) => {
        data.rooms.forEach(room => {
            const node = document.createElement("option");
            node.setAttribute('value', room)
            const textnode = document.createTextNode(`${room}`);
            node.appendChild(textnode)
            $rooms.appendChild(node);            
        });
        
    })