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
    expect(screen.getByText(`Welcome to Beat the Keys, ${playerName}!`)).toBeInTheDocument();
});

test("Join modal renders", () => {
    render(<HomeScreen playerName={playerName}/>);
    const startGameButton = screen.getByText("Join Game");
    userEvent.click(startGameButton);
    // Verify that the join modal is displayed after clicking "Join Game"
    expect(screen.getByText("Enter an Invite Code")).toBeInTheDocument();
    expect(document.querySelector(".form-control")).toBeInTheDocument();
    expect(document.querySelector(".btn-primary")).toBeInTheDocument();
});

test("Leaderboard renders", () => {
    render(<HomeScreen playerName={playerName}/>);
    // Verify that the leaderboard columns are visible
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Best WPM")).toBeInTheDocument();
    expect(screen.getByText("Average WPM")).toBeInTheDocument();
    expect(screen.getByText("Total Games")).toBeInTheDocument();
    expect(screen.getByText("Total Wins")).toBeInTheDocument();
});