<a name="readme-top"></a>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#built-with">Prerequisites and Local Installation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## Hosted at https://nqnt41.github.io/casual-pkmn-team-builder/

## About The Project

This project is a custom React team builder for the Pokémon series of video games, intended to allow users to create and customize their ideal teams of six Pokémon. This is done by utilizing and manipulating the data pulled from the RESTful open-source API entitled the [PokéAPI](https://pokeapi.co/) - a massive online database of information spanning all forms of Pokémon media.

Information on every Pokémon for the selected game is attained by the team builder program and stored via a collection of Pokémon objects containing the key information on each creature, including name, Pokédex entry, typing, game location, and more.

By either searching for a Pokémon using its name or National Pokédex ID number, or by manually browsing the collection of Pokémon sprites on the HTML grid and left clicking the desired Pokémon, that creature will be added to the current team. A team in the application can contain a maximum of six Pokémon at a time. 

A user's current team can be stored by the program through the Store Team button at the top of the UI. Up to five teams of Pokémon can be stored in this way at a time. Use of LocalStorage allows this data to be held on subsequent visits to the hosting page. By inputting the number of the team to be removed and hitting either Enter or the Remove key, a stored team can be removed to make space for more teams.

The top of the UI also bears a button allowing the user to decide which Pokédex's worth of Pokémon should be displayed, which is useful for if a user wants to consider Pokémon from multiple regions. 

Finally, by left clicking on the Pokémon present in the user's current team will allow for the removal of that Pokémon from the team. Right clicking on the Pokémon within the HTML grid achieves the same effect.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

This program was built with the React framework, which combines JavaScript, CSS, and HTML elements.

Plans are also being made to incorporate database support into the project for storing, accessing, and sharing teams alongside user authentication, likely through the use of Google Firebase.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Prerequisites and Local Installation

* After creating a local repository, the following command can be used to pull the program from GitHub for use on a personal system
  ```sh
  git init
  git remote add https://github.com/Nqnt41/casual-pkmn-team-builder.git
  git pull origin master
  ```

* Dependencies for running the project locally can be installed simply by using the command:
  ```sh
  npm install npm@latest -g
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

Completed:
- [x] Set up basic UI and PokéAPI data access.
- [x] Implement team system - limit to six Pokémon per team and allow the Pokéball symbol behind them to reflect the colors of their types.
- [x] Create system to store Pokémon types and set color codes per type.
- [x] Implement search function.
- [x] Allow access to Pokémon variant forms and create popup window for easy selection of these variants.
- [x] Allow saving of five teams at a time.
- [x] Implement LocalStorage to maintain user selections on page refresh or reaccess.
- [x] Implement page to choose a starting generation to decrease loading times before program can be utilized.

In-Progress:
- [ ] Implement database support, likely with Google Firebase. Allow user sign-in, storage of up to five teams, accessing of those teams, as well as ability to share teams with others via a seed.
- [ ] Develop dynamic type chart to show a team's strengths and weaknesses.
- [ ] Create more themes for the page beyond the current default theming - one for each main-series game.
- [ ] Allow filtering through Pokémon based on typing, states, weaknesses, evolution level, and more.
- [ ] Create system to display detailed info for each Pokémon selected for one's team, in particular features such as location per game that would be useful for casual players.

See the [open issues](https://github.com/Nqnt41/casual-pkmn-team-builder/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Ryan Coveny - please contact me with any concerns via ryanpcoveny@gmail.com

Project Link: [https://github.com/Nqnt41/casual-pkmn-team-builder](https://github.com/Nqnt41/casual-pkmn-team-builder)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

All data used in this project is provided by [PokéAPI](https://pokeapi.co/), and all credit for such data lies with them.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
