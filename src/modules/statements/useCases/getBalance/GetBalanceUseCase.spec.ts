import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let statementsRepository: IStatementsRepository;

let usersRepository: IUsersRepository;

let getBalanceUseCase: GetBalanceUseCase;

let createUserUseCase: CreateUserUseCase;


describe("Get balance", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    usersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should be able to get a balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })

    const balance = await getBalanceUseCase.execute({ user_id: String(user.id) })

    expect(balance).toHaveProperty("statement")
    expect(balance).toHaveProperty("balance")
  })

  it("Should not be able to get a balance of a not existent user", () => {

    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "fdsafd" })
    }).rejects.toBeInstanceOf(GetBalanceError)

  })

})
