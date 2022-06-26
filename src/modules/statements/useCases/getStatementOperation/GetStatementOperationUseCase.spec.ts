import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


let usersRepository: IUsersRepository;

let statementsRepository: IStatementsRepository

let getStatementOperationUseCase: GetStatementOperationUseCase;

let createUserUseCase: CreateUserUseCase;

let createStatementUseCase: CreateStatementUseCase;



describe("GetStatement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    statementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);

    createUserUseCase = new CreateUserUseCase(usersRepository);

    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  })

  it("Should be able to get a statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })

    const statement = await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "some thing cool here"
    })

    const getStatentOperation = await getStatementOperationUseCase.execute({ user_id: String(user.id), statement_id: String(statement.id) })

    expect(getStatentOperation).toEqual(statement)

  })

  it("Should not be able to get a statement operation of a not existent user", async () => {

    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Lucas",
        email: "lucas@gmail.com",
        password: "fdafdadsaf"
      })

      const statement = await createStatementUseCase.execute({
        user_id: String(user.id),
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "some thing cool here"
      })

      await getStatementOperationUseCase.execute({ user_id: "fjdajfk", statement_id: String(statement.id) })

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)

  })


  it("Should not be able to get a statement operation of a not existent user", async () => {

    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Lucas",
        email: "lucas@gmail.com",
        password: "fdafdadsaf"
      })

      const statement = await createStatementUseCase.execute({
        user_id: String(user.id),
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "some thing cool here"
      })

      await getStatementOperationUseCase.execute({ user_id: String(user.id), statement_id: "fjjdjhsa" })

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

  })


})
