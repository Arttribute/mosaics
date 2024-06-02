# Mosaics

Mosaics is an on onchain multiplayer puzzle game powered by AI. Piece together tile puzzles from AI prompts, stake assets, earn NFTs, and collaboratively solve puzzles in multiplayer challenges for a top spot on the leaderboard!

## Project Description

Mosaics is more than just a puzzle game; it's a dynamic and immersive gaming experience powered by advanced technologies. Players are tasked with piecing together tiles to form images based on text prompts generated by a game agent. This agent, built on Galadriel, analyzes the player's performance on previous puzzles to tailor the difficulty level of the next challenge, ensuring a personalized and engaging experience.

With single-player and multiplayer modes, Mosaics offers various ways for players to enjoy the game. In single-player mode, individuals can tackle puzzles at their own pace, with the opportunity to mint completed images as NFTs. For those seeking a competitive edge, the Play to Earn mode allows players to stake tokens and earn rewards based on puzzle-solving performance. Failure to complete a puzzle results in a partial loss of the staked amount, adding a risk-reward element to the gameplay. In multiplayer mode, players can collaborate in real-time to solve puzzles together, fostering social interaction and teamwork.

Behind the scenes, Mosaics utilizes a range of technologies to power its gameplay and features. Galadriel's AI-generated prompts provide a personalized and challenging experience for players, while Ethereum Name Service (ENS) simplifies user identification by replacing complex Ethereum addresses with human-readable names. Smart contracts deployed on the Filecoin Calibration testnet manage NFT minting and staking mechanisms, ensuring secure and transparent transactions.

## How it's Made

Mosaics is built using a combination of technologies and frameworks to deliver a seamless gaming experience. Next.js serves as the front-end frameworks and Supabase as the database for off-chain information . The AI-generated images are created using Astria’s Stability Diffusion API, which allows for high-quality, customizable images based on textual prompts.

_Galadriel:_ The game agent, powered by Galadriel, generates text prompts used to create puzzle images. Analyzing the player's performance on previous puzzles, Galadriel tailors the difficulty level of each challenge, ensuring a personalized gaming experience.

_ENS:_ Mosaics integrates ENS for user identification, simplifying the identification process by replacing complex Ethereum addresses with human-readable names. This enhances user accessibility and improves overall engagement with the game.

_Huddle SDK:_ Mosaics incorporates the Huddle SDK for its multiplayer functionalities, allowing real-time communication and collaboration among players. By integrating Huddle SDK, Mosaics enables players to engage in collaborative puzzle-solving sessions and share cursor position data seamlessly. This enhances the social aspect of the game and provides a cohesive multiplayer experience for participants.

_Filecoin:_ Smart contracts deployed on the Filecoin Calibration testnet manage critical aspects of Mosaics' economy, including NFT minting and staking mechanisms. By leveraging Filecoin Calibration, Mosaics ensures the security and transparency of transactions related to NFTs and staking rewards.

### Contracts Addresses

#### On Galadriel Devnet:

_MosaicsGameAgent Address:_ 0xce61bbBF8f2873FDd4D6b92adbC4895BbEE87D54

#### On Filecoin Calibration Testnet:

_MosaicNFTReward Address:_ 0xbA9061540Bb7f9fEF0550430A8D86F11ad9f1dF6
_PlayToEarn Address:_ 0x3D7c9d3CF4502acD2951EBD185fC7124C1465226
