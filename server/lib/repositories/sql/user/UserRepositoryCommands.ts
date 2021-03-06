import { isoUsername, isoEmail, isoParsedPassword, ParsedUser } from '../../../domain/User'
import { tryCatch, TaskEither } from 'fp-ts/TaskEither'
import { toError } from 'fp-ts/Either'
import { sql } from '@pgtyped/query'
import {
  ISelectUserByUsernameCommandQuery,
  ISelectUserByUsernameCommandResult,
  ISelectUserByEmailCommandQuery,
  ISelectUserByEmailCommandResult,
  ISelectAllUsersCommandQuery,
  ISelectAllUsersCommandResult,
  IInsertUserCommandResult,
  IInsertUserCommandQuery
} from './UserRepositoryCommands.types'
import { db } from '../main'

const selectUserByUsernameCommand =
  sql<ISelectUserByUsernameCommandQuery>`SELECT * FROM users WHERE username = $u LIMIT 1`

export const selectUserByUsername = (u: string): TaskEither<Error, ISelectUserByUsernameCommandResult[]> => tryCatch(
  async () => await selectUserByUsernameCommand.run({ u }, db),
  toError
)

const selectUserByEmailCommand =
  sql<ISelectUserByEmailCommandQuery>`SELECT * FROM users WHERE email = $e LIMIT 1`

export const selectUserByEmail = (e: string): TaskEither<Error, ISelectUserByEmailCommandResult[]> => tryCatch(
  async () => await selectUserByEmailCommand.run({ e }, db),
  toError
)

const selectAllUsersCommand =
  sql<ISelectAllUsersCommandQuery>`SELECT * FROM users`
export const selectAllUsers = (): TaskEither<Error, ISelectAllUsersCommandResult[]> => tryCatch(
  async () => await selectAllUsersCommand.run(undefined, db),
  toError
)

const insertUserCommand =
  sql<IInsertUserCommandQuery>`INSERT INTO users (id, username, email, password) VALUES $user(id, username, email, password)`

export const insertUser = (user: ParsedUser): TaskEither<Error, IInsertUserCommandResult[]> => tryCatch(
  async () => await insertUserCommand.run({
    user: {
      ...user,
      username: isoUsername.unwrap(user.username),
      email: isoEmail.unwrap(user.email),
      password: isoParsedPassword.unwrap(user.password)
    }
  }, db),
  toError
)
