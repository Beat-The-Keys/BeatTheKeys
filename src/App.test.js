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

test("Join Modal Renders", () => {
    render(<HomeScreen playerName={playerName}/>);
    const startGameButton = screen.getByText("Join Game");
    userEvent.click(startGameButton);
    // Verify that the join modal is displayed after clicking "Join Game"
    expect(screen.getByText("Enter an Invite Code")).toBeInTheDocument();
    expect(document.querySelector(".form-control")).toBeInTheDocument();
    expect(document.querySelector(".btn-primary")).toBeInTheDocument();
});