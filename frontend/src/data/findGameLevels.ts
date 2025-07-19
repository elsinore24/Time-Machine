// Find the 1980s Icon - Game Level Data
export interface HiddenObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  explanation: string;
}

export interface GameLevel {
  id: number;
  name: string;
  background: string;
  description: string;
  hiddenObjects: HiddenObject[];
}

export const FIND_GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    name: "Rad 80s Arcade",
    background: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=1200&h=800&fit=crop",
    description: "Find the hidden treasures in this totally tubular arcade!",
    hiddenObjects: [
      {
        id: "walkman",
        name: "Sony Walkman",
        x: 850,
        y: 320,
        width: 60,
        height: 45,
        explanation: "You found the Walkman! This was like having Spotify in your pocket - the portable music revolution that let you take your tunes anywhere!"
      },
      {
        id: "rubiks_cube",
        name: "Rubik's Cube",
        x: 450,
        y: 180,
        width: 40,
        height: 40,
        explanation: "Totally tubular! The Rubik's Cube was the viral TikTok challenge of the 80s - everyone was obsessed with solving this colorful puzzle!"
      }
    ]
  },
  {
    id: 2,
    name: "Miami Vice Scene",
    background: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop",
    description: "Search through this rad Miami Vice scene for hidden 80s gems!",
    hiddenObjects: [
      {
        id: "boombox",
        name: "Ghetto Blaster",
        x: 1200,
        y: 400,
        width: 80,
        height: 50,
        explanation: "Awesome find! The boombox was like carrying a whole concert on your shoulder - the ultimate way to share your radical music taste!"
      },
      {
        id: "cassette_tape",
        name: "Cassette Tape",
        x: 600,
        y: 250,
        width: 35,
        height: 25,
        explanation: "Rad discovery! Cassette tapes were like playlists you could hold - making mixtapes was the ultimate way to show someone you cared!"
      },
      {
        id: "pac_man",
        name: "Pac-Man",
        x: 300,
        y: 500,
        width: 45,
        height: 45,
        explanation: "Waka-waka-awesome! Pac-Man was the mobile game that took over the world - everyone was chomping dots and running from ghosts!"
      }
    ]
  },
  {
    id: 3,
    name: "80s Movie Night",
    background: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
    description: "Discover iconic items hidden in this gnarly 80s movie scene!",
    hiddenObjects: [
      {
        id: "et_doll",
        name: "E.T. Figure",
        x: 750,
        y: 180,
        width: 50,
        height: 60,
        explanation: "Phone home! You found E.T.! This lovable alien was the biggest movie star of the 80s - everyone wanted to 'phone home' after seeing this classic!"
      },
      {
        id: "calculator_watch",
        name: "Calculator Watch",
        x: 1100,
        y: 350,
        width: 40,
        height: 30,
        explanation: "Totally radical tech! Calculator watches were the smartwatch of the 80s - having a computer on your wrist made you feel like a secret agent!"
      }
    ]
  }
];

export default FIND_GAME_LEVELS;