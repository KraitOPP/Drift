(() => {
  const userName = localStorage.getItem("user") || "User";

  console.log("Socket connection established");

  let playerId;
  let playerRef;

  const init = () => {
    const refs = firebase.database().ref(`players`);
    refs.on("value", (snapshot) => {
      users = snapshot.val();
      console.log(users);
      Object.keys(users).forEach((key) => {
        console.log(key);
      });
    });

    refs.on("child_added", (snapshot) => {
      const newUser = snapshot.val();
      console.log(newUser);
      if (newUser.id != playerId) {
        console.log("New User added");
        console.log(newUser);
      }
    });
  };

  firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      playerRef.set({
        id: playerId,
        name: userName,
        avatar: "Ami",
        x: 0,
        y: 0,
        z: 0,
      });

      playerRef.onDisconnect().remove();

      init();
    } else {
      //logged out.
    }
  });

  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
    });
})();
