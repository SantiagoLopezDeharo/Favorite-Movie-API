class Movie {
  constructor(title, id) {
    this.title = title;
    this.id = id
    this.users = [];
  }
  getTitle() {return this.title;}

  getId() {return this.id}

  addUser(usr)
  {
    this.users.push(usr);
  }

  removeUser(email)
  {
    this.users = this.users.filter(usr => usr.email !== email);
  }

}
