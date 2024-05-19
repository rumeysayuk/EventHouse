const User = require("../models/user");
const Role = require("../models/role");

// Register a new user with a role
exports.registerUser = (req, res) => {
  // İstekten gelen kullanıcı bilgilerini alın
  const { username, password, role } = req.body;

  // Yeni bir kullanıcı nesnesi oluşturun
  const newUser = new User({ username, password, role });

  // Kullanıcıyı kaydetme
  newUser.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Kullanıcı başarıyla kaydedildi" });
  });
};
// Login a user and create a session
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  User.authenticate(username, password, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a new session and store user id
    req.session.userId = user._id;

    res.json({ message: "Login successful" });
  });
};
