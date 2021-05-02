import React from 'react';

export default function LeaderboardItems(props) {
  return (
    <tr>
      <td>{props.username}</td>
      <td>{props.bestwpm}</td>
      <td>{props.avgwpm}</td>
      <td>{props.gamesplayed}</td>
      <td>{props.gameswon}</td>
    </tr>
  );
}
