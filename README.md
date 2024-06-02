# Mosaics

Mosaics is an on onchain multiplayer puzzle game powered by AI. Piece together tile puzzles from AI prompts, stake assets, earn NFTs, and collaboratively solve puzzles in multiplayer challenges for a top spot on the leaderboard!

## Project Description

Mosaics is more than just a puzzle game; it's a dynamic and immersive gaming experience powered by advanced technologies. Players are tasked with piecing together tiles to form images based on text prompts generated by a game agent. This agent, built on Galadriel, analyzes the player's performance on previous puzzles to tailor the difficulty level of the next challenge, ensuring a personalized and engaging experience.

With single-player and multiplayer modes, Mosaics offers various ways for players to enjoy the game. In single-player mode, individuals can tackle puzzles at their own pace, with the opportunity to mint completed images as NFTs. For those seeking a competitive edge, the Play to Earn mode allows players to stake tokens and earn rewards based on puzzle-solving performance. Failure to complete a puzzle results in a partial loss of the staked amount, adding a risk-reward element to the gameplay. In multiplayer mode, players can collaborate in real-time to solve puzzles together, fostering social interaction and teamwork.

Behind the scenes, Mosaics utilizes a range of technologies to power its gameplay and features. Galadriel's AI-generated prompts provide a personalized and challenging experience for players, while Ethereum Name Service (ENS) simplifies user identification by replacing complex Ethereum addresses with human-readable names. Smart contracts deployed on the Filecoin Calibration testnet manage NFT minting and staking mechanisms, ensuring secure and transparent transactions.

## How it's Made

Mosaics is built using a combination of technologies and frameworks to deliver a seamless gaming experience. Next.js serves as the front-end frameworks and Supabase as the database for off-chain information . The AI-generated images are created using Astria’s Stability Diffusion API, which allows for high-quality, customizable images based on textual prompts while Ably facilitates web socket connection for multiplayer capabilities.

**Galadriel:** The game agent, powered by Galadriel, generates text prompts used to create puzzle images. Analyzing the player's performance on previous puzzles, Galadriel tailors the difficulty level of each challenge, ensuring a personalized gaming experience.

**ENS:** Mosaics integrates ENS for user identification, simplifying the identification process by replacing complex Ethereum addresses with human-readable names. This enhances user accessibility and improves overall engagement with the game.

**Huddle SDK:** Mosaics incorporates the Huddle SDK for its multiplayer functionalities, allowing real-time communication and collaboration among players. By integrating Huddle SDK, Mosaics enables players to engage in collaborative puzzle-solving sessions and share cursor position data seamlessly. This enhances the social aspect of the game and provides a cohesive multiplayer experience for participants.

**Filecoin:** Smart contracts deployed on the Filecoin Calibration testnet manage critical aspects of Mosaics' economy, including NFT minting and staking mechanisms. By leveraging Filecoin Calibration, Mosaics ensures the security and transparency of transactions related to NFTs and staking rewards.

### Contracts Addresses

#### On Galadriel Devnet:

**MosaicsGameAgent Address:** 0xce61bbBF8f2873FDd4D6b92adbC4895BbEE87D54

#### On Filecoin Calibration Testnet:

**MosaicNFTReward Address:** 0xbA9061540Bb7f9fEF0550430A8D86F11ad9f1dF6
**PlayToEarn Address:** 0x3D7c9d3CF4502acD2951EBD185fC7124C1465226

## Deep Dive into the Game Mechanics

#### Puzzle Generation

Puzzle generation in Mosaics involves creating unique, AI-driven challenges tailored to the player's performance. The process is dynamic and adapts based on player performance, ensuring a consistently engaging experience.

**1. Prompt Generation:** The AI game agent, Galadriel, generates a text prompt describing the image for the puzzle. This prompt can vary in complexity based on the player's previous performance.
**2. Image Creation:** Using the Astria Stability Diffusion API, the text prompt is converted into a high-quality image.
**3. Tile Splitting:** The generated image is split into smaller, shuffled tiles that the player must rearrange to form the original image.
**4. Next Puzzle Generation:** Based on the player's final score, game agent generates the next puzzle's prompt, difficulty, number of moves, and time given.

```bash
   +--------------------+            +-------------------------+
   |                    |            |                         |
   |    Galadriel       +------------> Astria’s Stability      |
   |                    |  Prompt    |   Diffusion API         |
   |   (Game Agent)     |            |  (Generate Image)       |
   |                    |            |                         |
   +--------------------+            +----------+--------------+
            ^                                   |
            |                                   | Image
            |                                   v
            |                  +--------------------------+
            |                  |                          |
            |                  | Image Split into Tiles   |
            |                  |                          |
            |                  +-----------+--------------+
            |                               |
            |                               | Shuffled Tiles
            |                               v
            |                  +--------------------------+
            |                  |                          |
            |                  | Player Solves Puzzle     |
            |                  |                          |
            |                  +--------------------------+
            |                               |
            |                               |
            +_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _+
                Performance Feedback
```

#### Game Scoring

Scoring in Mosaics is designed to reward efficiency and skill. Players earn points based on their performance in solving the puzzles, with deductions for taking too long or using too many moves.

**Base Score:** Each puzzle starts with a base score.
**Time Penalty:** Points are deducted based on the time taken to complete the puzzle. The faster the player completes the puzzle, the fewer points are deducted.
**Move Penalty:** Points are also deducted for each move taken. Fewer moves result in a higher score.
**Completion Bonus:** Completing the puzzle within the given constraints awards a bonus to the player's score.

#### Staking and NFT Rewards

In the Play to Earn mode, players can stake tokens to participate in puzzle challenges. This mode introduces a risk-reward element where players earn rewards based on their puzzle-solving performance.

**Staking Tokens:** Players stake a certain amount of tokens to enter the puzzle challenge.
**Performance-Based Rewards:** Rewards are distributed based on how well the player performs. Better performance yields higher rewards.
**Partial Loss:** If the player fails to complete the puzzle, they incur a partial loss of their staked tokens.
**NFT Minting:** Successfully completing puzzles allows players to mint the completed image as an NFT, adding a collectible aspect to the game.

## Try out the deployed Version

You can try out the Mosaics live demo at [mosaics.arttribute.io](https://mosaics.arttribute.io)

## Running it locally

- First, install the required packages

```bash
npm install
```

- Have the env variables as shown in the `env.ecample` in your `.env.local` file

- Then run `npm run dev` in your terminal to start the Next js app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

#### MIT
