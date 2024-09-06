const createUser = (req, res) => {
    // Logic to create a new user
    const user = req.body;
    res.json({ message: 'User created', user });
};

