import React from 'react';

export default function LeaderboardItems(thisEmail, email, bestwpm, avgwpm, gamesplayed, gameswon) {
  if (thisEmail === email) {
    return (
      <div>
      <tr>
        <td>
          <strong>{email}</strong>
        </td>
        <td>
          <strong>{bestwpm}</strong>
        </td>
        <td>
          <strong>{avgwpm}</strong>
        </td>
        <td>
          <strong>{gamesplayed}</strong>
        </td>
        <td>
          <strong>{gameswon}</strong>
        </td>
      </tr>
      </div>
    );
  }
  return (
    <tr>
      <td>{email}</td>
      <td>{bestwpm}</td>
      <td>{avgwpm}</td>
      <td>{gamesplayed}</td>
      <td>{gameswon}</td>
    </tr>
  );
}
