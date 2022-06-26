import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: IUsersRepository;

let statementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;

let createUserUseCase: CreateUserUseCase;


describe("Create statement", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    statementsRepository = new InMemoryStatementsRepository()

    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to do a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })


    const balance = await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "some thing cool here"
    })

    expect(balance).toHaveProperty("id")

  })

  it("should be able to do a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })

    await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "some thing cool here"
    })

    const balance = await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.WITHDRAW,
      amount: 10,
      description: "some thing cool here"
    })

    expect(balance).toHaveProperty("id")

  })


  it("should not be able to a statement operation with a non existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "fjdskafjk",
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "some thing cool here"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })


  it("should not be able to do a withdraw with no balance enough", () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "Lucas",
        email: "lucas@gmail.com",
        password: "fdafdadsaf"
      })

      await createStatementUseCase.execute({
        user_id: String(user.id),
        type: OperationType.WITHDRAW,
        amount: 10,
        description: "some thing cool here"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

  })




})
