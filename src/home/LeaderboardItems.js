import React from 'react';

export default function LeaderboardItems(props) {
  if (props.thisEmail === props.email) {
    return (
      <tr>
        <td>
          <strong>{props.index}</strong>
        </td>
        <td>
          <strong>{props.username}</strong>
        </td>
        <td>
          <strong>{props.bestwpm}</strong>
        </td>
        <td>
          <strong>{props.avgwpm}</strong>
        </td>
        <td>
          <strong>{props.gamesplayed}</strong>
        </td>
        <td>
          <strong>{props.gameswon}</strong>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td>{props.index}</td>
      <td>{props.username}</td>
      <td>{props.bestwpm}</td>
      <td>{props.avgwpm}</td>
      <td>{props.gamesplayed}</td>
      <td>{props.gameswon}</td>
    </tr>
  );
}
