import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeScreen from "./home/HomeScreen";

const playerName = "Group 4";
const playerEmail = "beat-the-keys.njit4@gmail.com"
test("Lobby UI rendered", () => {
    render(<HomeScreen playerName={playerName} playerEmail={playerEmail}/>);
    // Verify that the main action buttons and welcome text are rendered
    expect(screen.getByText("Start Game")).toBeInTheDocument();
    expect(screen.getByText("Join Game")).toBeInTheDocument();
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText(`Logged In: ${playerEmail}`)).toBeInTheDocument();
});

test("Typeracer renders after starting game", () => {
    render(<HomeScreen playerName={playerName}/>);
    const startGameButton = screen.getByText("Start Game");
    userEvent.click(startGameButton);
    // Verify that the typeracer UI is displayed after clicking "Start Game"
    expect(screen.getByText("Begin typing:")).toBeInTheDocument();
    expect(document.querySelector(".p")).toBeInTheDocument();
    expect(document.querySelector(".bXYnqS")).toBeInTheDocument();
});