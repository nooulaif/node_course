var getUser = (id, callback) => {
  var user = {
    id: id,
    name: 'Bob'
  };

  setTimeout(() => {
    callback(user);
  }, 3000);
};

getUser(123, (userObject) => {
  console.log(userObject);
});
