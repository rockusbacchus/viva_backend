const User = require("../model/User");
const bcrpyt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd) {
    return res
      .status(400)
      .json({ message: "Email address and password are required." });
  }

  // check for duplicate email addresses in the database
  const duplicate = await User.findOne({ email: email }).exec();

  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt the password
    const hashedPwd = await bcrpyt.hash(pwd, 10);
    // store the new user
    const result = await User.create({
      email: email,
      password: hashedPwd,
    });

    res.status(201).json({ success: `New user with email ${email} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
