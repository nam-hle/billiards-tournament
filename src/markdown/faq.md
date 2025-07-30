## How is a player's ranking determined in a group?

Players are ranked based on the following tiebreakers, in order:

1. **Total Points** – Players with more match points rank higher.
2. **Rack Difference** – Calculated as `rackWins - rackLosses`; higher difference ranks higher.
3. **Rack Wins** – If rack differences are equal, the player with more total rack wins ranks higher.
4. **Head-to-Head Result** – If still tied, the winner of the direct match between the two players is ranked higher.
5. **Player Name** – As a final fallback, names are compared alphabetically.

## How a Player's Elo Rating Is Calculated

Each player starts with a default Elo rating of `1500`. After every match, their rating is updated based on the outcome and how expected that outcome was.
The system uses an expected score (ranges between 0 and 1) formula to calculate the probability of a player winning, with `rA` and `rB` are the current ratings of the two players:

```
expectedScore(rA, rB) = 1 / (1 + 10 ** ((rB - rA) / 400))
```

If the higher-rated player wins, their rating increases slightly. If the lower-rated player wins, their rating increases more significantly.
The rating change is calculated with the formula with `actualScore` is 1 for a win and 0 for a loss, and `K` is a constant set to `32`:

```
newRating = currentRating + K * (actualScore - expectedScore)
```

For example, after a match, the winner's rating becomes

```
newWinnerRating = rWinner + 32 * (1 - expectedScore)
```

and the loser's rating becomes

```
newLoserRating = rLoser + 32 * (0 - expectedScore)
```

Over time, as more matches are played, each player’s rating will reflect their performance relative to others.
