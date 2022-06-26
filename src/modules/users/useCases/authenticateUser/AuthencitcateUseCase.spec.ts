import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Autenticate user", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);

  })

  it("should be able to authenticate an user", async () => {

    await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })

    const auth = await authenticateUserUseCase.execute({
      email:"lucas@gmail.com",
      password: "fdafdadsaf"
    })


    expect(auth).toHaveProperty("token")

  })


  it("should not be able to authenticate a non existent user", async () => {
    await expect(authenticateUserUseCase.execute({
      email: "false@email.com",
      password: "1234"
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate with incorrect password", async () => {

    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })


    await expect(authenticateUserUseCase.execute({
      email: user.email,
      password: "2533"
    })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
