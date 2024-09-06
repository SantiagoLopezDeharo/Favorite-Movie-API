class User {
    constructor(email, firstName, lastName, password) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.password = password;
      this.favMovies = [];
    }
  
    // Getter for full name
    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  
    // Method to update password
    updatePassword(newPassword) {
      this.password = newPassword;
    }
  
    // Method to display user information (without password)
    displayUserInfo() {
      return {
        email: this.email,
        name: this.getFullName(),
      };
    }

    // Method to add a movie to the user's collection
    addMovie(movie) {
      this.movies.push(movie);
    }
  
    // Method to remove a movie from the user's collection by title
    removeMovie(title) {
      this.movies = this.movies.filter(movie => movie.title !== title);
    }
  }