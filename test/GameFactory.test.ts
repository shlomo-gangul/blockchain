import { GameFactory } from "../contracts/GameFactory";
import { DilemmaGame } from "../contracts/DilemmaGame";

describe("GameFactory", () => {
  let gameFactory: GameFactory;

  beforeEach(() => {
    gameFactory = new GameFactory();
  });

  it("should create a DilemmaGame", () => {
    const game = gameFactory.createGame("DilemmaGame");
    expect(game).toBeInstanceOf(DilemmaGame);
  });

  it("should initialize DilemmaGame with default values", () => {
    const game = gameFactory.createGame("DilemmaGame");
    expect(game.players).toHaveLength(0);
    expect(game.rounds).toBe(0);
    expect(game.maxRounds).toBe(10);
  });

  // Add more tests here based on your requirements
});
