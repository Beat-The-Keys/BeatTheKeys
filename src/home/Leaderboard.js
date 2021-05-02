import {useState, React, useEffect} from 'react';
import {socket} from '../LoginScreen';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import LeaderboardItems from './LeaderboardItems.js';

export default function Leaderboard(playerEmail) {
    const [sortBy, changeSortBy] = useState("bestwpm");
    const [title, changeTitle] = useState("Best WPM");
    const [dbEmails, orderDBEmails] = useState([]);
    const [dbBestWPM, orderDBBestWPM] = useState([]);
    const [dbAVGWPM, orderDBAVGWPM] = useState([]);
    const [dbGamesPlayed, orderDBGamesPlayed] = useState([]);
    const [dbGamesWon, orderDBGamesWon] = useState([]);
    
    socket.emit('leaderboard', {sortBy}); // when the leaderboard is first rendered
        
    useEffect(() => {
        socket.on('updateLeaderboard', (data) => {
          console.log(data);
          orderDBEmails(data.db_emails);
          orderDBBestWPM(data.db_bestwpm);
          orderDBAVGWPM(data.db_avgwpm);
          orderDBGamesPlayed(data.db_gamesplayed);
          orderDBGamesWon(data.db_gameswon);
        });
        
    }, []);
    function changeSortOrder(sort_query) {
        changeSortBy(sort_query);
        if(sort_query==="bestwpm"){
            changeTitle("Best WPM");
        }
        if(sort_query==="avgwpm"){
            changeTitle("Average WPM");
        }
        if(sort_query==="gamesplayed"){
            changeTitle("Total Games");
        }
        if(sort_query==="gamesplayed"){
            changeTitle("Total Wins");
        }
        socket.emit('leaderboard', {sortBy});
    }

    return (
            <div>
            <h3>Sort By:</h3>
                <DropdownButton
                alignRight
                title={title}
                id="dropdown-menu-align-right"
                onSelect={changeSortOrder}
                >
                    <Dropdown.Item eventKey="bestwpm">Best WPM</Dropdown.Item>
                    <Dropdown.Item eventKey="avgwpm">Average WPM</Dropdown.Item>
                    <Dropdown.Item eventKey="gamesplayed">Total Games</Dropdown.Item>
                    <Dropdown.Item eventKey="gameswon">Total Wins</Dropdown.Item>
                </DropdownButton>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Users</th>
                      <th scope="col">Best WPM</th>
                      <th scope="col">Average WPM</th>
                      <th scope="col">Total Games</th>
                      <th scope="col">Total Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbEmails.map((item, index) => (
                        <LeaderboardItems
                        key={index}
                        thisEmail={playerEmail}
                        email={item}
                        bestwpm={dbBestWPM[index]}
                        avgwpm={dbAVGWPM[index]}
                        gamesplayed={dbGamesPlayed[index]}
                        gameswon={dbGamesWon[index]}
                        />
                    ))}
                  </tbody>
                </table>
            </div>
      );
}