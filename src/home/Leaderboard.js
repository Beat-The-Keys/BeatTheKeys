import {useState, React, useEffect} from 'react';
import {socket} from '../login/LoginScreen.js';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import LeaderboardItems from './LeaderboardItems.js';
import Table from 'react-bootstrap/Table'
import styled from 'styled-components';

export default function Leaderboard({prop}) {
    const {playerEmail} = prop[0];
    const [sortBy, changeSortBy] = useState("bestwpm");
    const [title, changeTitle] = useState("Sort By");
    const [dbEmails, orderDBEmails] = useState([]);
    const [dbUsersnames, orderDBUsersnames] = useState([]);
    const [dbBestWPM, orderDBBestWPM] = useState([]);
    const [dbAVGWPM, orderDBAVGWPM] = useState([]);
    const [dbGamesPlayed, orderDBGamesPlayed] = useState([]);
    const [dbGamesWon, orderDBGamesWon] = useState([]);
        
    useEffect(() => {
        socket.on('updateLeaderboard', (data) => {
          console.log(data);
          orderDBEmails(data.db_emails)
          orderDBUsersnames(data.db_usersnames);
          orderDBBestWPM(data.db_bestwpm);
          orderDBAVGWPM(data.db_avgwpm);
          orderDBGamesPlayed(data.db_gamesplayed);
          orderDBGamesWon(data.db_gameswon);
        });
        
    }, []);
    function changeSortOrder(sort_query) {
        socket.emit('leaderboard', {sort_query});
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
        if(sort_query==="gameswon"){
            changeTitle("Total Wins");
        }
    }

    return (
            <div>
            <center> <h3>Leaderboard:</h3>
                <DropdownButton
                alignRight
                title={title}
                id="Leaderboard"
                onSelect={changeSortOrder}
                >
                    <Dropdown.Item eventKey="bestwpm">Best WPM</Dropdown.Item>
                    <Dropdown.Item eventKey="avgwpm">Average WPM</Dropdown.Item>
                    <Dropdown.Item eventKey="gamesplayed">Total Games</Dropdown.Item>
                    <Dropdown.Item eventKey="gameswon">Total Wins</Dropdown.Item>
                </DropdownButton>
                </center>
                <TableNew striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th scope="col">Rank</th>
                      <th scope="col">Users</th>
                      <th scope="col">Best WPM</th>
                      <th scope="col">Average WPM</th>
                      <th scope="col">Total Games</th>
                      <th scope="col">Total Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbUsersnames.slice(0,10).map((item, index) => (
                        <LeaderboardItems
                        key={index}
                        thisEmail={playerEmail}
                        email={dbEmails[index]}
                        index={index + 1}
                        username={item}
                        bestwpm={dbBestWPM[index]}
                        avgwpm={dbAVGWPM[index]}
                        gamesplayed={dbGamesPlayed[index]}
                        gameswon={dbGamesWon[index]}
                        />
                    ))}
                  </tbody>
                </TableNew>
            </div>
      );
}

const TableNew = styled(Table)`
    border: 3px solid #007bff !important;
    border-radius: 20px;
    color: #000000 !important;
    background-color: white;
`