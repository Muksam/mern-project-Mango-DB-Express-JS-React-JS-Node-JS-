const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

// @route  Post/api/users
// @desc   Test route
// @acess  public

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),

    check('email', 'Please include a valid Email').isEmail(),

    check(
      'password',
      'Please Enter a password with 6 or more character'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: Array() });
    }

    const { name, email, password } = req.body;

    try {
      //if user exist
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ error: [{ msg: 'User already exists' }] });
      }
      //Get user gvatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
