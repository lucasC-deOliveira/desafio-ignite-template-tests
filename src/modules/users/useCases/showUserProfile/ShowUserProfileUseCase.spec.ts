import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;


describe("User profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);

  })

  it("should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "fdafdadsaf"
    })

    const user_id = String(user.id);

    const profile = await showUserProfileUseCase.execute(user_id)

    expect(profile).toEqual(user)

  })


  it("should not be able to show user profile of a no existent user", () => {

    expect(async () => {
      const user_id = "8575";

      await showUserProfileUseCase.execute(user_id)

    }).rejects.toBeInstanceOf(ShowUserProfileError)

  })
})
