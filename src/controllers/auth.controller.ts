import axios from 'axios';
import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Controller } from '../interfaces/controller.interface';
import { User } from '../interfaces/user.interface';
import {
  findUser,
  findUserById,
  loginRequest,
  updateUserPassword,
} from '../queries/UserQueries';
class AuthController implements Controller {
  readonly path: string = '/auth';
  readonly router: Router = Router();
  private static readonly anonymousRoutes: string[] = ['/register', '/login'];

  constructor() {
    this.initializeMeddleware();
    this.initializeRoutes();
  }
  initializeMeddleware(): void {
    this.initializeMeddleWare();
  }
  /**
   * @override base class
   */
  protected initializeMeddleWare(): void {
    this.router.use(
      this.hasToken,
      (req: Request, res: Response, next: NextFunction) => {
        console.log(req.baseUrl);
        console.log(req.url);
        // const IP =
        //   req.socket.remoteAddress;
        // let ip;
        // if (req.headers['x-forwarded-for']) {
        //   const forwarded: string = req.headers['x-forwarded-for'] as string;
        //   console.log(forwarded);
        //   ip = forwarded?.split(',').shift();
        // } else if (req.socket && req.socket.remoteAddress) {
        //   ip = req.socket.remoteAddress;
        // } else {
        //   ip = req.ip;
        // }
        console.log(' client IP is *********************' + req.ip);
        //console.log(IP);

        if (req.baseUrl === '/auth') {
          switch (req.url) {
            //  case '/token': // TODO COMMENT WHEN FINISH
            case '/register':
            case '/login':
            case '/refresh':
              //  case '/getAccessToken':
              console.log('NEXT....');
              return next();
              break;
            default:
              res.status(403);
              break;
          }
        }
        return res.status(403).json({
          status: 'Error',
          message: `Forbiden from path ${req.baseUrl}`,
        });
      }
    );
  }

  initializeRoutes(): void {
    //  this.router.post('/getAccessToken', this.getAccessToken);
    this.router.post('/register', this.register); // role: anonymous
    this.router.post('/login', this.login); // role: anonymous
    this.router.post('/refresh', this.refresh); // forwarded JWT
    // this.router.post('/vote', this.login);
    // this.router.post('/login', this.login);
    // this.router.post('/send-reset-password-email', this.sendResetPasswordEmail);
    // this.router.post('/reset-password', this.resetPassword);
  }

  private register = async (
    req: Request,
    res: Response
  ): Promise<void> /* Promise<Response>*/ => {
    if (req.body.input === undefined) {
      res.status(200).json({ found: false });
      return;
    }
    const userInputArgs = req.body.input.arg1;
    console.log('user: ');
    console.log(userInputArgs);
    const query = findUser;
    const adminPassword: string = process.env.HASURA_ADMIN_PASSWORD as string;
    const url: string = process.env.HASURA_URL as string;

    axios({
      method: 'post',
      url,
      data: {
        query: query,
        variables: {
          egn: userInputArgs.egn,
          email: userInputArgs.email,
          pin: userInputArgs.pin,
        },
        // opeartionName: 'Login',
      },
      headers: {
        'x-hasura-admin-secret': adminPassword,
      },
    })
      .then(({ data }) => {
        if (data.errors /*|| data.data.users?.length === 0*/) {
          return res.status(400).json(data);
        }
        const userFromDb = data.data.users[0];
        const found = data.data.users.length > 0;
        if (found === true) {
          this.changPass(userFromDb.id, userInputArgs.password).then(
            response => {
              console.log(response);
              return res.status(200).json({ found });
            }
          );
        } else {
          return res.status(200).json({ found });
        }
      })
      .catch(err => console.warn(err));

    // try {
    //   response = await this.db
    //     .comunicate(variables, query, 'RegisterUserAndComapny')
    //     .catch(error => {
    //       console.log('from error', error);
    //       res.status(401).json(error);
    //       throw new Error(error);
    //     });

    //   user.id = response.data.data.insert_users_one;

    //   await this.sendVerificationEmail(user);

    //   const resp: RegisterOutput = response.data.data.insert_users_one;

    //   return res.json(resp);
    // } catch (error) {
    //   const message = this.parseErrors(response);
    //   res.status(400).json({ message });
    // }

    // return res.status(200).json({ found: true }); // this.getSignedToken('user') });
  };

  /**
   * Updates password of user by id. Password will be encryped from postgres.
   * @param userId
   * @param password
   */
  private changPass = async (
    userId: number,
    password: string
  ): Promise<void> => {
    const query = updateUserPassword;
    const adminPassword: string = process.env.HASURA_ADMIN_PASSWORD as string;
    const url: string = process.env.HASURA_URL as string;
    axios({
      method: 'post',
      url,
      data: {
        query: query,
        variables: {
          id: userId,
          password: password,
        },
      },
      headers: {
        'x-hasura-admin-secret': adminPassword,
      },
    }).then(({ data }) => {
      console.log(data);
      return 'changed';
    });
  };
  /**
   * Login function.
   * @param req
   * @param res
   * @returns
   */
  private login = async (req: any, res: Response) => {
    console.log('THE NEXT IS LOGIN');
    if (req.body.input === undefined) {
      return res.status(200).json({
        accessToken: null,
        fetchToken: null,
      });
    }

    const userLoginArgs = req.body.input?.args;
    console.log(req.body.input);

    const query = loginRequest;
    const adminPassword: string = process.env.HASURA_ADMIN_PASSWORD as string;
    const url: string = process.env.HASURA_URL as string;

    axios({
      method: 'post',
      url,
      data: {
        query: query,
        variables: { egn: userLoginArgs.egn, password: userLoginArgs.password },
      },
      headers: {
        'x-hasura-admin-secret': adminPassword,
      },
    })
      .then(({ data }) => {
        console.log('LOGIN RESPONSE: ');
        console.log(data);
        console.log(data.data.users);

        if (data.errors) {
          return res.status(400).json(data);
        }
        if (data.data.users.length > 0) {
          const user = data.data.users[0];
          console.log(' user : ');
          console.log(user);
          // user.currentRole = user.roleType;
          const accessToken = this.getSignedToken(true, user);
          const fetchToken = this.getSignedToken(false, user);
          return res.status(200).json({
            accessToken,
            fetchToken,
            //  user: user, // data.data.users,
          });
        } else {
          return res.status(200).json({
            accessToken: null,
            fetchToken: null,
            //  user: user, // data.data.users,
          });
        }
      })
      .catch(err => console.warn(err));
  };

  private refresh = async (req: any, res: Response) => {
    console.log('THE NEXT IS refresh token');
    if (req.body.input === undefined) {
      return res.status(200).json({
        fetchToken: null,
      });
    }

    const switchRoleInputArguments = req.body.input?.args;
    const query = findUserById;
    const adminPassword: string = process.env.HASURA_ADMIN_PASSWORD as string;
    const url: string = process.env.HASURA_URL as string;
    axios({
      method: 'post',
      url,
      data: {
        query: query,
        variables: { userId: switchRoleInputArguments.userId },
      },
      headers: {
        'x-hasura-admin-secret': adminPassword,
      },
    })
      .then(({ data }) => {
        console.log('LOGIN RESPONSE: ');
        console.log(data);
        console.log(data.data.users_by_pk);

        if (data.errors) {
          return res.status(400).json(data);
        }
        const user = data.data.users_by_pk;
        if (user) {
          const roleIndex: number = switchRoleInputArguments.roleIndex;
          console.log(roleIndex);
          const fetchToken = this.getSignedToken(false, user, roleIndex);
          return res.status(200).json({
            fetchToken,
          });
        } else {
          return res.status(200).json({
            fetchToken: null,
          });
        }
      })
      .catch(err => console.warn(err));
  };

  private getSignedToken(
    isAccessToken: boolean,
    user: User,
    roleIndex = 0
  ): string {
    let defaultRoleForToken = user.roleType.value;
    if (roleIndex === 1) {
      defaultRoleForToken = user.secondRoleType.value;
    }

    const allowedRoles = [user.roleType.value];
    if (user.secondRoleType) {
      allowedRoles.push(user.secondRoleType.value);
    }
    const token = jwt.sign(
      {
        sub: isAccessToken ? 'access' : 'fetch',
        role: defaultRoleForToken,
        iat: parseInt('' + moment().valueOf() / 1000),
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': allowedRoles,
          'x-hasura-default-role': defaultRoleForToken, // Permissions in this role will be used to retrieve data
          'x-hasura-user-id': user.id.toString(),
          'x-hasura-org-id': 'unknown',
          'x-hasura-custom': 'custom-value',
        },
        user: isAccessToken ? user : null,
      },
      process.env.SIGN,
      {
        expiresIn: isAccessToken ? '1Y' : '15m',
      }
    );
    return token;
  }

  // private resetPassword = (req: Request, res: Response): void => {
  //   const { email, password, token }: ChangePasswordInput = req.body.input.args;
  //   const url = process.env.HASURA_URL;
  //   const adminPassword = process.env.HASURA_ADMIN_PASSWORD;
  //   const query = changeUserPassword;

  //   bcrypt.hash(password, 10, (err, hash) => {
  //     if (err) {
  //       console.log(err);

  //       res.status(400).json({ message: err.message });
  //       return;
  //     }

  //     const variables: ChangePasswordInput = {
  //       token,
  //       password: hash,
  //       email,
  //     };

  //     const config: AxiosRequestConfig = {
  //       url,
  //       method: 'post',
  //       headers: {
  //         'x-hasura-admin-secret': adminPassword,
  //       },
  //       data: {
  //         query,
  //         variables,
  //       },
  //     };

  //     this.updatePasswordInDB(config)
  //       .then(({ data }) => {
  //         const user: User = data.data.update_users.returning[0];

  //         const accessToken = this.signTokken(user);
  //         const refreshToken = this.signTokken(user, true);

  //         res
  //           .cookie('refreshToken', refreshToken.token, {
  //             httpOnly: true,
  //             expires: new Date(refreshToken.expires * 1000),
  //           })
  //           .json({ accessToken });
  //       })
  //       .catch(error => {
  //         res.status(400).json({ message: error });
  //       });
  //   });
  // };

  // private sendResetPasswordEmail = (req: Request, res: Response): void => {
  //   const email = req.body.input.email;
  //   this.getUserByEmail(email).then(({ data }) => {
  //     console.log(data.data.users.length);

  //     if (data.data.users.length === 0) {
  //       res
  //         .status(401)
  //         .json({ message: 'Грешка в системата! Опитайте по-късно' });

  //       return;
  //     }
  //     const userId = data.data.users[0].id;
  //     const url = process.env.HASURA_URL;
  //     const siteUrl = process.env.SITE_URL;
  //     const adminPassword: string = process.env.HASURA_ADMIN_PASSWORD as string;
  //     const query = insertPasswordRequest;
  //     const token = genRadnomString(150);

  //     axios({
  //       method: 'post',
  //       url,
  //       headers: {
  //         'x-hasura-admin-secret': adminPassword,
  //       },
  //       data: {
  //         query,
  //         variables: { userId, token },
  //       },
  //     })
  //       .then(({ data }) => {
  //         const mailer = new Mailer();
  //         const config: Options = {
  //           from: 'Espi Mail Robot 🤖 <no-replay@espi-mse.com>', // sender address
  //           to: email, // list of receivers
  //           // cc: "asdf",
  //           subject: 'Заявка за смяна на парола 🧾', // Subject line
  //           text: `Здравейте, Заявили сте смяна на паролата. Можете да кликнете на линка, или да го копирате и да го поставите в адресната лента на броузера Ви.
  //            Ако не сте заявявали Вие смяна на паролата, не е нужно да предприемате други действия.
  //            ${siteUrl}/auth/reset-password?email=${email}&token=${data.data.insert_password_reset_requests_one.token}.

  //            Поздрави, екипът на https://espi-mse.com`, // plain text body
  //           html: `Здравейте, <br>Заявили сте смяна на паролата. Можете да кликнете на линка, или да го копирате и да го поставите в адресната лента на броузера Ви.
  //           <b> Ако не сте заявявали Вие смяна на паролата, не е нужно да предприемате други действия. </b>.<br>
  //           <a href='${siteUrl}/auth/reset-password?email=${email}&token=${data.data.insert_password_reset_requests_one.token}' target='_blank'>
  //             ${siteUrl}/auth/reset-password?email=${email}&token=${data.data.insert_password_reset_requests_one.token}
  //           </a>
  //           <br><hr style='color: #a6a6a6'><br>Поздрави, <br>екипът на <a href='https://espi-mse.com' target='_blank'>ESPI</a>`, // html body
  //         };

  //         mailer
  //           .sendEmail(config)
  //           .then(({ response }) => res.json({ message: response }))
  //           .catch(error => {
  //             console.log(error);

  //             res.json(error);
  //           });
  //       })
  //       .catch(error => {
  //         console.log(error);

  //         res.json(error);
  //       });
  //   });
  // };

  private hasToken(req: any, res: Response, next: () => void) {
    console.log(' has token');

    const bearerHeader = req.headers['authorization'];
    if (bearerHeader !== undefined) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      try {
        //console.log(bearerToken);
        validateToken(bearerToken);
        req.token = bearerToken;
        next();
      } catch (error) {
        console.log(error);
        res.status(403).json({
          status: 'Error',
          message: `JWT is modifyed : from path ${req.baseUrl}`,
        });
      }
    } else {
      console.log('NO TOKEN');
      console.log(req.url);
      console.log(AuthController.anonymousRoutes);
      // eslint-disable-next-line no-constant-condition
      if (AuthController.anonymousRoutes.indexOf(req.url) > -1) {
        next();
      } else {
        res.status(403).json({
          status: 'Error',
          message: `Missing JWT: from path ${req.baseUrl}`,
        });
      }
      // res.send(403);
    }
  }
}

function validateToken(token: any) {
  if (token) {
    jwt.verify(token, process.env.SIGN, (jwtError: any, jwtResponse: any) => {
      if (jwtError) {
        console.log(jwtError);
        throw Error('undefined');
      } else {
        console.log('VALID TOKEN');
      }
    });
  } else {
    throw Error('undefined');
  }
}

export default AuthController;
