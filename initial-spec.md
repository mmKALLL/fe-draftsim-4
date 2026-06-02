Multiplayer mobile-first game for 2-6 players, simulating the excitement of the draft portion of an FE11 draft. The "simulated FE11" is split into five phases:
earlygame, early midgame, midgame, mid-lategame, lategame. The players get points from each phase based on who has the most "team power" in that phase, in a 8-5-3-2-1-(-2) spread for 6 players, 5-3-2-1-(-2) for 5 players, 5-3-2-0 for 4 players, 4/2/0 for 3 players, and 2/0 for 2 players.

Characters come with stats that indicate their usefulness in each phase, e.g. Wrys: 3/1/1/0/0 or Wolf: 0/0/1/2/3, or Frey: 1/1/2/2/2, or Boah: 0/0/3/1/1. The maximum power for a section is 4, e.g. Gotoh and Nagi are 0/0/0/0/4 since they only appear there. Players take turns to draft characters, being able to see what was picked, and the game always displays the totals by phase for each player. Although there's also a variant that hides each player's picks, only showing the totals at 5 picks and at the end of the game.

Players can optionally enable bonuses for the draft. They are as follows: you need at least 1 of the following:

- mage (magic)
- cleric (healing)
- archer/ballista (pierce)
- knight/cavalier (defense)
- cavalier/pegasus (movement)

Players gain a 1-point bonus for each covered group.

For covering the weapon triangle, each completed trio of sword/lance/axe gives +1 point.

For gathering the three pegasi sisters, get +2 points. ("Triangle attack")

The game can also be played with alternative "solo" scoring, where each section of the game has certain thresholds for points: e.g. in earlygame you get 5 points if you exceed a total of 10 power, 3 points if you exceed 7 power, 2 points with 5 power, and so on. This mode can also be played with multiple players, and offers an interesting variant.

Another variant is the SOYO, where each person picks a team for their opponent. Not sure if it's interesting though. Players can choose any number of human and computer players to join. First it has local multiplayer only.

The standard rules and character pool for a FE11 draft are below. Every player picks 10 characters. However, instead of Marth, Jagen, Nagi/Gotoh being free, they're also drafted. The first generic "Zas" is also included, to make the list a beautiful 60 characters long.

For the draft format, there are variants to choose from:

1. characters are randomly formed into 10-character packs, on their turn a player chooses one and passes the rest to the next player

2. players can choose from among all the characters, in snake draft order

Developed with TS+Vite. Although the game is mobile first and supports a compact display of info, a PC-width version should also exist, supporting the display of team members' "cards" (face graphic + stats + weapon type).

Some cards can optionally have extra effects, like Xane becoming a copy of another card you own. Please ideate a few more effects and include them in types.ts, but don't implement them yet.

Drafting rules (reference only):

1. This draft is for 5 players.

2. Marth, Jagen and Nagi/Gotoh are free for all to use.

3. The game will be played on (difficulty).

Rules:

1. Undrafted units may recruit characters, visit houses, trade, meatshield, and shop.

2. Undrafted units may not do anything not listed above, including but not limited to opening chests/doors.

3. Gaiden (and prologue, if NM) chapters do not count towards the total turncount up to 20 turns taken.

4. You are free to reclass undrafted units to whatever you want.

5. Marth may not Seize the throne in Chapter 19 before Turn 5.

Other:

1. Forging, Wi-Fi Shop, and usage of the Warp staff are strictly prohibited.

2. You may not use loaner units.

Penalties:

1. Undrafted units have a 4 turn penalty, per unit per chapter.

Teams:

(names go here)

[spoiler=units remaining]Frey
Norne
Cain
Abel
Caeda
Gordin
Draug
Wrys
Ogma
Bord
Cord
Barst
Castor
Darros
Julian
Lena
Navarre
Merric
Matthis
Hardin
Sedgar
Wolf
Roshea
Vyland
Wendell
Rickard
Athena
Bantu
Caesar
Radd
Roger
Jeorge
Maria
Minerva
Linde
Jake
Midia
Dolph
Macellan
Tomas
Boah
Horace
Beck
Astram
Palla
Catria
Arran
Samson
Xane
Etzel
Est
Tiki
Lorenz
Ymir
Elice
