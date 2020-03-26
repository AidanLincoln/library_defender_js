const usersURL = 'http://localhost:3000/users'
const gamesURL = 'http://localhost:3000/games'
let thisUser;
let thisGame;
let userGames;

document.addEventListener("DOMContentLoaded", function() {
    const newPlayer = document.getElementById("createAccountButton")
    const oldPlayer = document.getElementById("signInButton")
    const signOut = document.getElementById('signOutButton')
    const newGame = document.getElementById('newGameButton')
    const oldGame = document.getElementById('oldGameButton')

    const noGames = document.createElement('p')
    noGames.id = "noGamesMessage"
    noGames.textContent = "You have no saved games"
    noGames.className = "formtitle"

    const sideNav = document.getElementById('sidenav')
        const sideNavLevel = document.getElementById('sidenavlevel')
        const sideNavLibrary = document.getElementById('sidenavlibrary')
        const sideNavMoney = document.getElementById('sidenavmoney')

    const bigLogo = document.getElementById('bigLogoDiv')

    
    newPlayer.addEventListener("click", function() {
        event.preventDefault()

        const contentBox = document.getElementById('bigbox')
        contentBox.className = "contentbox"
        const newUserForm = document.getElementById('newUserForm')
        bigLogo.hidden = true
        oldUserForm.hidden = true
        newUserForm.hidden = false
        noGames.hidden = true

        newUserForm.addEventListener('submit', function(event){
            event.preventDefault()
            
            contentBox.className = "hiddencontentbox"
            newPlayer.hidden = true
            oldPlayer.hidden = true
            signOut.hidden = false
            newGame.hidden = false
            oldGame.hidden = false
            newUserForm.hidden = true
            bigLogo.hidden = false
          
            createUser(event)
        })
    })
  
    oldPlayer.addEventListener("click", function(event) {
        event.preventDefault()
        
        const contentBox = document.getElementById('bigbox')
        const oldUserForm = document.getElementById('oldUserForm')
        contentBox.className = "contentbox"
        bigLogo.hidden = true
        newUserForm.hidden = true
        oldUserForm.hidden = false
        noGames.hidden = true

        oldUserForm.addEventListener('submit', function(event){
            event.preventDefault()
            getUsers(event.target.username.value)
            contentBox.className = "hiddencontentbox"
            newPlayer.hidden = true
            oldPlayer.hidden = true
            signOut.hidden = false
            newGame.hidden = false
            oldGame.hidden = false
            newUserForm.hidden = true
            bigLogo.hidden = false
            oldUserForm.hidden = true

        })
    })

    signOut.addEventListener('click', function(event){
        event.preventDefault()
        const contentBox = document.getElementById('bigbox')
        contentBox.className = "hiddencontentbox"
        const map = document.getElementById('maparea')
        map.hidden = true
        sideNav.hidden = true
        thisGame = null
        thisUser = null
        userGames = null
        newPlayer.hidden = false
        oldPlayer.hidden = false
        signOut.hidden = true
        newGame.hidden = true
        oldGame.hidden = true
        newUserForm.hidden = true
        bigLogo.hidden = false
        noGames.hidden = true
    })

    newGame.addEventListener('click', function(event){
        event.preventDefault()
        createGame()
        const map = document.getElementById('maparea')
        const contentBox = document.getElementById('bigbox')
        bigLogo.hidden = true
        contentBox.className = "contentbox"
        map.hidden = false
        sideNav.hidden = false
        noGames.hidden = true

    })

    oldGame.addEventListener('click', function(event){
        event.preventDefault()
        const contentBox = document.getElementById('bigbox')
        sideNav.hidden = true
        bigLogo.hidden = true
        contentBox.className = "contentbox"
        const map = document.getElementById('maparea')
        map.hidden = true
        const oldGamesForm = document.getElementById('oldGamesForm')
        const games = showGames(gameData) 
        games.forEach(function(game){
            const oldGameInput = document.createElement('input')
            oldGameInput.type = "button"
            oldGameInput.textContent = `Level ${game.level} - $${game.money} - ${game.created_at}`
            oldGamesForm.appendChild(oldGameInput)
            oldGameInput.addEventListener('click', function(event){
                event.preventDefault()
                // start game
                // thisGame = 

                // we need this stuff \/
                oldGamesForm.hidden = true
                map.hidden = false
                sideNav.hidden = false

                
            })
        })
    })
  })
  
  function createUser (event) {
    newUser = {name: `${event.target.newUserName.value}`}

    thisUser = fetch(usersURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            newUser
        })      
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        thisUser = data
        console.log(data)
    })
    .catch((error) => {
        console.error('Error:', error)
        alert ("OH FUCK - TRY STARTING A RAILS SERVER");
    })
  }

  function getUsers (currentUser) {
    fetch(usersURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        findUser(data, currentUser)
    })
    .catch((error) => {
        console.error('Error:', error)

        alert ("OH FUCK - YOU SHOULD PROBABLY START A RAILS SERVER");
    })

  }

  function findUser(allUsers, currentUser) {
    thisUser = allUsers.find(user => user.name.toLowerCase() === currentUser.toLowerCase())
  }



  function showGames () {
      console.log("this makes a ul that lists all of the user's games that you can click on to load that game")

      const ourGames = fetch(gamesURL)
      .then(function(response) {
          return response.json()
      })
      .then(function(data) {
          makeButtons(data)
      })
      .catch((error) => {
        console.error('Error:', error)
        alert ("OH FUCK - YOU SHOULD PROBABLY START A RAILS SERVER");
      })
  
  }

  function makeButtons(allGames) {
    const games = allGames.filter(game => game.user_id === thisUser.id)
    const oldGames = document.getElementById("oldGameDiv")
    oldGames.hidden = false
    if(games || games.length < 1){
        games.forEach(function(game){
            const oldGameInput = document.createElement('button')
            oldGameInput.className = "navbutton"
            oldGameInput.textContent = `Level ${game.current_level} - $${game.money} - ${game.created_at}`
            oldGamesForm.appendChild(oldGameInput)
            oldGameInput.addEventListener('click', function(event){
                event.preventDefault()
                //write code that starts a game with the button
                //also we need to add code that shows some message if there are no games for a user
                //stuff for aidan to do
            })
        })
    }else{
        noGames.hidden = false
    }
  }

  function createGame () {
    thisGame = fetch(gamesURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            thisUser
        })      
    })
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        thisGame = data
    })
    .catch((error) => {
        alert ("OH FUCK - TRY STARTING A RAILS SERVER");
        console.error('Error:', error)
    })

  }