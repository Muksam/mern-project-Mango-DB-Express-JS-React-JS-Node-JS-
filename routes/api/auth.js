const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route  Get/api/auth
// @desc   Test route
// @acess  public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.mesage);
    res.status(500).send('Server not found');
  }
});

router.post(
  '/',
  [
    check('email', 'Please include a valid Email').isEmail(),

    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: Array() });
    }

    const { email, password } = req.body;

    try {
      //if user exist
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      //Return json webtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw error;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(400).send('Server Error');
    }
  }
);

module.exports = router;
