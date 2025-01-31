import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/user.mjs';
import authToken from '../hook/auth.mjs';

dotenv.config();

const Users = class Users {
  constructor(app, connect) {
    this.app = app;
    this.UserModel = connect.model('User', UserModel);

    this.run();
  }

  deleteById() {
    this.app.delete('/user/:id', authToken, (req, res) => {
      try {
        this.UserModel.findByIdAndDelete(req.params.id).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  showByEmail() {
    this.app.get('/user/:email', (req, res) => {
      try {
        this.UserModel.findOne({ email: req.params.email }).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:email -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  create() {
    this.app.post('/user/', authToken, (req, res) => {
      try {
        const userModel = new this.UserModel(req.body);

        userModel.save().then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(200).json({});
        });
      } catch (err) {
        console.error(`[ERROR] users/create -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  login() {
    this.app.post('/login/', (req, res) => {
      try {
        const { email, password } = req.body;

        this.UserModel.findOne({ email }).then((user) => {
          if (!user) {
            res.status(404).json({
              code: 404,
              message: 'User not found'
            });
          } else if (user.password === password) {
            const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: '24h' });
            res.status(200).json({
              token
            });
          } else {
            res.status(401).json({
              code: 401,
              message: 'Unauthorized'
            });
          }
        }).catch((err) => {
          res.status(500).json({
            code: 500,
            error: err,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/login -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  updateProfile() {
    this.app.put('/user/:id', authToken, (req, res) => {
      try {
        const { id } = req.params;
        const {
          firstname, lastname, email, description
        } = req.body;

        this.UserModel.findByIdAndUpdate(id, {
          firstname,
          lastname,
          email,
          description
        }).then((user) => {
          res.status(200).json(user || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] users/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  run() {
    this.create();
    this.showByEmail();
    this.deleteById();
    this.login();
    this.updateProfile();
  }
};

export default Users;
