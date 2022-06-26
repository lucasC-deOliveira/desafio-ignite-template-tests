import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"


let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafda"
    })

    expect(user).toHaveProperty("id");

  })


  it("should not be able to create a user with same email", async () => {


    expect(async () => {
      await createUserUseCase.execute({
        name: "Lucasss",
        email: "lucas@gmails.com",
        password: "fdafda"
      })
      await createUserUseCase.execute({
        name: "Lucass",
        email: "lucas@gmails.com",
        password: "fdafda"
      })
    }).rejects.toBeInstanceOf(CreateUserError)

  })



})
