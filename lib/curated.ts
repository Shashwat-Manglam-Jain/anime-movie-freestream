export interface CuratedMovie {
  title: string;
  year: number;
  tmdbId: number;
  imdbId: string;
  genre: string;
  rating: string;
  poster: string;
}

export interface CuratedTvShow {
  title: string;
  year: number;
  tmdbId: number;
  imdbId: string;
  genre: string;
  rating: string;
  seasons: number;
  poster: string;
}

const IMG = "https://image.tmdb.org/t/p/w500";

export interface CollectionMovie {
  title: string;
  year: number;
  tmdbId: number;
  poster: string;
}

export interface MovieCollection {
  name: string;
  tmdbIds: number[];
  movies: CollectionMovie[];
}

export const MOVIE_COLLECTIONS: MovieCollection[] = [
  {
    name: "Harry Potter",
    tmdbIds: [671, 672, 673, 674, 675, 767, 12444, 12445],
    movies: [
      { title: "Philosopher's Stone", year: 2001, tmdbId: 671, poster: `${IMG}/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg` },
      { title: "Chamber of Secrets", year: 2002, tmdbId: 672, poster: `${IMG}/sdEOH0992YZ0QSxgXNIGLq1ToUi.jpg` },
      { title: "Prisoner of Azkaban", year: 2004, tmdbId: 673, poster: `${IMG}/aWxwnYoe8p2d2fcxOqtvAtJ72Rw.jpg` },
      { title: "Goblet of Fire", year: 2005, tmdbId: 674, poster: `${IMG}/fEZpFGpOELhGQ3jZRb5TiDIyzOA.jpg` },
      { title: "Order of the Phoenix", year: 2007, tmdbId: 675, poster: `${IMG}/s836PRwHkp6rovxKKwVEqfLRcaD.jpg` },
      { title: "Half-Blood Prince", year: 2009, tmdbId: 767, poster: `${IMG}/o2j4sHMiDGE7NjLHjYiMRqWoCOv.jpg` },
      { title: "Deathly Hallows Part 1", year: 2010, tmdbId: 12444, poster: `${IMG}/iGoXIpQb7Pot00EEdwpwPajheZ5.jpg` },
      { title: "Deathly Hallows Part 2", year: 2011, tmdbId: 12445, poster: `${IMG}/c54HpQmuwXjHq2C9wmoACjxoomG.jpg` },
    ],
  },
  {
    name: "The Lord of the Rings",
    tmdbIds: [120, 121, 122],
    movies: [
      { title: "The Fellowship of the Ring", year: 2001, tmdbId: 120, poster: `${IMG}/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg` },
      { title: "The Two Towers", year: 2002, tmdbId: 121, poster: `${IMG}/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg` },
      { title: "The Return of the King", year: 2003, tmdbId: 122, poster: `${IMG}/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg` },
    ],
  },
  {
    name: "The Dark Knight Trilogy",
    tmdbIds: [272, 155, 49026],
    movies: [
      { title: "Batman Begins", year: 2005, tmdbId: 272, poster: `${IMG}/8RW2runSEc34IwKN2D1aPcJd2UL.jpg` },
      { title: "The Dark Knight", year: 2008, tmdbId: 155, poster: `${IMG}/qJ2tW6WMUDux911BTUgMe9YW.jpg` },
      { title: "The Dark Knight Rises", year: 2012, tmdbId: 49026, poster: `${IMG}/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg` },
    ],
  },
  {
    name: "John Wick",
    tmdbIds: [245891, 324552, 458156, 603692],
    movies: [
      { title: "John Wick", year: 2014, tmdbId: 245891, poster: `${IMG}/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg` },
      { title: "Chapter 2", year: 2017, tmdbId: 324552, poster: `${IMG}/hXWBc0ioZP3cN4zCzZvQ3OM9eUi.jpg` },
      { title: "Chapter 3 – Parabellum", year: 2019, tmdbId: 458156, poster: `${IMG}/ziEGdwTUakKgiKSgjoJJ2aWSGMD.jpg` },
      { title: "Chapter 4", year: 2023, tmdbId: 603692, poster: `${IMG}/vZloFAK7NmvMGKE7Q2KHnMRFSGU.jpg` },
    ],
  },
  {
    name: "Spider-Man (MCU)",
    tmdbIds: [315635, 429617, 634649],
    movies: [
      { title: "Homecoming", year: 2017, tmdbId: 315635, poster: `${IMG}/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg` },
      { title: "Far From Home", year: 2019, tmdbId: 429617, poster: `${IMG}/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg` },
      { title: "No Way Home", year: 2021, tmdbId: 634649, poster: `${IMG}/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg` },
    ],
  },
  {
    name: "The Matrix",
    tmdbIds: [603, 604, 605, 624860],
    movies: [
      { title: "The Matrix", year: 1999, tmdbId: 603, poster: `${IMG}/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg` },
      { title: "Reloaded", year: 2003, tmdbId: 604, poster: `${IMG}/9TGHDvWrqKBzwDxDSrq3nRGa0s0.jpg` },
      { title: "Revolutions", year: 2003, tmdbId: 605, poster: `${IMG}/t1wm4PgOQ8e4z1C6tk1rAoK8Hhi.jpg` },
      { title: "Resurrections", year: 2021, tmdbId: 624860, poster: `${IMG}/8c4a8kE7PizaGQQnditMmI1xPRp.jpg` },
    ],
  },
  {
    name: "The Godfather",
    tmdbIds: [238, 240, 242],
    movies: [
      { title: "The Godfather", year: 1972, tmdbId: 238, poster: `${IMG}/3bhkrj58Vtu7enYsRolD1fZdja1.jpg` },
      { title: "Part II", year: 1974, tmdbId: 240, poster: `${IMG}/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg` },
      { title: "Part III", year: 1990, tmdbId: 242, poster: `${IMG}/lm3pQ2QoQ16pextRsmnUbG2onES.jpg` },
    ],
  },
  {
    name: "Dune",
    tmdbIds: [438631, 693134],
    movies: [
      { title: "Dune", year: 2021, tmdbId: 438631, poster: `${IMG}/d5NXSklXo0qyIYkgV94XAgMIckC.jpg` },
      { title: "Dune: Part Two", year: 2024, tmdbId: 693134, poster: `${IMG}/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg` },
    ],
  },
  {
    name: "Avengers",
    tmdbIds: [24428, 99861, 299536, 299534],
    movies: [
      { title: "The Avengers", year: 2012, tmdbId: 24428, poster: `${IMG}/RYMX2wcKCBAr24UyPD7xwmhMm62.jpg` },
      { title: "Age of Ultron", year: 2015, tmdbId: 99861, poster: `${IMG}/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg` },
      { title: "Infinity War", year: 2018, tmdbId: 299536, poster: `${IMG}/7WsyChQLEftFiDhRkZmHsm0mNbH.jpg` },
      { title: "Endgame", year: 2019, tmdbId: 299534, poster: `${IMG}/or06FN3Dka5tukK1e9GDTIrGTds.jpg` },
    ],
  },
  {
    name: "Spider-Verse",
    tmdbIds: [324857, 569094],
    movies: [
      { title: "Into the Spider-Verse", year: 2018, tmdbId: 324857, poster: `${IMG}/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg` },
      { title: "Across the Spider-Verse", year: 2023, tmdbId: 569094, poster: `${IMG}/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg` },
    ],
  },
  {
    name: "Mad Max",
    tmdbIds: [76341, 786892],
    movies: [
      { title: "Fury Road", year: 2015, tmdbId: 76341, poster: `${IMG}/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg` },
      { title: "Furiosa", year: 2024, tmdbId: 786892, poster: `${IMG}/iADOJ8Zymht2JPMoy3R7xceZprc.jpg` },
    ],
  },
];

export const TOP_MOVIES: CuratedMovie[] = [
  // ── 2024–2025 ──
  { title: "Dune: Part Two", year: 2024, tmdbId: 693134, imdbId: "tt15239678", genre: "Sci-Fi, Adventure", rating: "8.5", poster: `${IMG}/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg` },
  { title: "Deadpool & Wolverine", year: 2024, tmdbId: 533535, imdbId: "tt6263850", genre: "Action, Comedy", rating: "7.7", poster: `${IMG}/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg` },
  { title: "Inside Out 2", year: 2024, tmdbId: 1022789, imdbId: "tt22022452", genre: "Animation, Family", rating: "7.6", poster: `${IMG}/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg` },
  { title: "Furiosa: A Mad Max Saga", year: 2024, tmdbId: 786892, imdbId: "tt12037194", genre: "Action, Sci-Fi", rating: "7.5", poster: `${IMG}/iADOJ8Zymht2JPMoy3R7xceZprc.jpg` },
  { title: "The Wild Robot", year: 2024, tmdbId: 1184918, imdbId: "tt29623480", genre: "Animation, Sci-Fi", rating: "8.2", poster: `${IMG}/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg` },
  { title: "Alien: Romulus", year: 2024, tmdbId: 945961, imdbId: "tt18412256", genre: "Horror, Sci-Fi", rating: "7.2", poster: `${IMG}/b33nnKl1GSFbao4l3fZDDqsMSF6.jpg` },
  { title: "Gladiator II", year: 2024, tmdbId: 558449, imdbId: "tt9218128", genre: "Action, Drama", rating: "6.9", poster: `${IMG}/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg` },
  { title: "A Quiet Place: Day One", year: 2024, tmdbId: 762441, imdbId: "tt13433802", genre: "Horror, Sci-Fi", rating: "6.8", poster: `${IMG}/hU42CRBGAMSc8eVr2EPauMhOvNx.jpg` },
  { title: "Godzilla x Kong: The New Empire", year: 2024, tmdbId: 823464, imdbId: "tt14539740", genre: "Action, Sci-Fi", rating: "6.5", poster: `${IMG}/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg` },
  { title: "Civil War", year: 2024, tmdbId: 929590, imdbId: "tt17279496", genre: "Action, Drama", rating: "7.0", poster: `${IMG}/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg` },

  // ── 2023 ──
  { title: "Oppenheimer", year: 2023, tmdbId: 872585, imdbId: "tt15398776", genre: "Drama, History", rating: "8.3", poster: `${IMG}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg` },
  { title: "Spider-Man: Across the Spider-Verse", year: 2023, tmdbId: 569094, imdbId: "tt9362722", genre: "Animation, Action", rating: "8.7", poster: `${IMG}/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg` },
  { title: "John Wick: Chapter 4", year: 2023, tmdbId: 603692, imdbId: "tt10366206", genre: "Action, Thriller", rating: "7.7", poster: `${IMG}/vZloFAK7NmvMGKE7Q2KHnMRFSGU.jpg` },
  { title: "Killers of the Flower Moon", year: 2023, tmdbId: 466420, imdbId: "tt5906664", genre: "Crime, Drama", rating: "7.6", poster: `${IMG}/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg` },
  { title: "Barbie", year: 2023, tmdbId: 346698, imdbId: "tt1517268", genre: "Comedy, Fantasy", rating: "6.8", poster: `${IMG}/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg` },
  { title: "Guardians of the Galaxy Vol. 3", year: 2023, tmdbId: 447365, imdbId: "tt6791350", genre: "Action, Sci-Fi", rating: "7.9", poster: `${IMG}/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg` },
  { title: "The Boy and the Heron", year: 2023, tmdbId: 508883, imdbId: "tt6587046", genre: "Animation, Fantasy", rating: "7.5", poster: `${IMG}/t5Yumm9gOrMeNLH2sZHTIVsTKDW.jpg` },
  { title: "Mission: Impossible – Dead Reckoning Part One", year: 2023, tmdbId: 575264, imdbId: "tt9603212", genre: "Action, Thriller", rating: "7.6", poster: `${IMG}/NNxYkU70HPurnNCSiCjYAmacwm.jpg` },

  // ── 2022 ──
  { title: "Everything Everywhere All at Once", year: 2022, tmdbId: 545611, imdbId: "tt6710474", genre: "Action, Sci-Fi", rating: "8.0", poster: `${IMG}/w3LxiVYdWWRvEVdn5RYq6jIqkb6.jpg` },
  { title: "The Batman", year: 2022, tmdbId: 414906, imdbId: "tt1877830", genre: "Crime, Action", rating: "7.7", poster: `${IMG}/74xTEgt7R36Fpooo50r9T25onhq.jpg` },
  { title: "Top Gun: Maverick", year: 2022, tmdbId: 361743, imdbId: "tt1745960", genre: "Action, Drama", rating: "8.2", poster: `${IMG}/62HCnUTziyWQb9QfRsSs1XSRn09.jpg` },
  { title: "Avatar: The Way of Water", year: 2022, tmdbId: 76600, imdbId: "tt1630029", genre: "Sci-Fi, Adventure", rating: "7.6", poster: `${IMG}/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg` },
  { title: "Black Panther: Wakanda Forever", year: 2022, tmdbId: 505642, imdbId: "tt9114286", genre: "Action, Sci-Fi", rating: "6.7", poster: `${IMG}/sv1xJUazXeYqALzczSZ3O6nkH75.jpg` },
  { title: "The Banshees of Inisherin", year: 2022, tmdbId: 674324, imdbId: "tt11813216", genre: "Drama, Comedy", rating: "7.7", poster: `${IMG}/4yFG6cSPaCaPhyJ1jRGag1jnODO.jpg` },

  // ── 2019–2021 ──
  { title: "Avengers: Endgame", year: 2019, tmdbId: 299534, imdbId: "tt4154796", genre: "Action, Sci-Fi", rating: "8.4", poster: `${IMG}/or06FN3Dka5tukK1e9GDTIrGTds.jpg` },
  { title: "Joker", year: 2019, tmdbId: 475557, imdbId: "tt7286456", genre: "Crime, Drama", rating: "8.4", poster: `${IMG}/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg` },
  { title: "Parasite", year: 2019, tmdbId: 496243, imdbId: "tt6751668", genre: "Thriller, Drama", rating: "8.5", poster: `${IMG}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg` },
  { title: "1917", year: 2019, tmdbId: 530915, imdbId: "tt8579674", genre: "War, Drama", rating: "8.3", poster: `${IMG}/iZf0KyrE25z1sage4SYFLCCrMi9.jpg` },
  { title: "Knives Out", year: 2019, tmdbId: 546554, imdbId: "tt8946378", genre: "Comedy, Mystery", rating: "7.9", poster: `${IMG}/pThyQovXQrw2m0s9x82twj48Jq4.jpg` },
  { title: "No Time to Die", year: 2021, tmdbId: 370172, imdbId: "tt2382320", genre: "Action, Thriller", rating: "6.8", poster: `${IMG}/iUgygt3fscRMdqIIa0kR81j681M.jpg` },
  { title: "Dune", year: 2021, tmdbId: 438631, imdbId: "tt1160419", genre: "Sci-Fi, Adventure", rating: "7.8", poster: `${IMG}/d5NXSklXo0qyIYkgV94XAgMIckC.jpg` },
  { title: "Spider-Man: No Way Home", year: 2021, tmdbId: 634649, imdbId: "tt10872600", genre: "Action, Sci-Fi", rating: "8.2", poster: `${IMG}/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg` },
  { title: "The Suicide Squad", year: 2021, tmdbId: 436969, imdbId: "tt11080016", genre: "Action, Comedy", rating: "7.2", poster: `${IMG}/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg` },

  // ── Classics & All-Time ──
  { title: "The Shawshank Redemption", year: 1994, tmdbId: 278, imdbId: "tt0111161", genre: "Drama", rating: "9.3", poster: `${IMG}/9cjIGRjYBfDXvUQZTR4ZsEi4Mfm.jpg` },
  { title: "The Godfather", year: 1972, tmdbId: 238, imdbId: "tt0068646", genre: "Crime, Drama", rating: "9.2", poster: `${IMG}/3bhkrj58Vtu7enYsRolD1fZdja1.jpg` },
  { title: "The Dark Knight", year: 2008, tmdbId: 155, imdbId: "tt0468569", genre: "Action, Crime", rating: "9.0", poster: `${IMG}/qJ2tW6WMUDux911BTUgMe9YW.jpg` },
  { title: "Pulp Fiction", year: 1994, tmdbId: 680, imdbId: "tt0110912", genre: "Crime, Drama", rating: "8.9", poster: `${IMG}/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg` },
  { title: "Inception", year: 2010, tmdbId: 27205, imdbId: "tt1375666", genre: "Sci-Fi, Action", rating: "8.8", poster: `${IMG}/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg` },
  { title: "Interstellar", year: 2014, tmdbId: 157336, imdbId: "tt0816692", genre: "Sci-Fi, Adventure", rating: "8.7", poster: `${IMG}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg` },
  { title: "Fight Club", year: 1999, tmdbId: 550, imdbId: "tt0137523", genre: "Drama, Thriller", rating: "8.8", poster: `${IMG}/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg` },
  { title: "The Matrix", year: 1999, tmdbId: 603, imdbId: "tt0133093", genre: "Sci-Fi, Action", rating: "8.7", poster: `${IMG}/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg` },
  { title: "Goodfellas", year: 1990, tmdbId: 769, imdbId: "tt0099685", genre: "Crime, Drama", rating: "8.7", poster: `${IMG}/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg` },
  { title: "Forrest Gump", year: 1994, tmdbId: 13, imdbId: "tt0109830", genre: "Drama, Romance", rating: "8.8", poster: `${IMG}/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg` },
  { title: "The Lord of the Rings: The Return of the King", year: 2003, tmdbId: 122, imdbId: "tt0167260", genre: "Fantasy, Adventure", rating: "9.0", poster: `${IMG}/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg` },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, tmdbId: 120, imdbId: "tt0120737", genre: "Fantasy, Adventure", rating: "8.8", poster: `${IMG}/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg` },
  { title: "Gladiator", year: 2000, tmdbId: 98, imdbId: "tt0172495", genre: "Action, Drama", rating: "8.5", poster: `${IMG}/ty8TGRuvJLPUmAR1H1nRIsgpvim.jpg` },
  { title: "Whiplash", year: 2014, tmdbId: 244786, imdbId: "tt2582802", genre: "Drama, Music", rating: "8.5", poster: `${IMG}/7fn624j5lj3xTme2SgiLCeuedmO.jpg` },
  { title: "The Wolf of Wall Street", year: 2013, tmdbId: 106646, imdbId: "tt0993846", genre: "Crime, Comedy", rating: "8.2", poster: `${IMG}/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg` },
  { title: "The Silence of the Lambs", year: 1991, tmdbId: 274, imdbId: "tt0102926", genre: "Thriller, Crime", rating: "8.6", poster: `${IMG}/uS9m8OBk1RVfUPm4AKTn16W5IHe.jpg` },
  { title: "Se7en", year: 1995, tmdbId: 807, imdbId: "tt0114369", genre: "Crime, Thriller", rating: "8.6", poster: `${IMG}/6yoghtyTpznpBik8EngEmJskVUO.jpg` },
  { title: "Schindler's List", year: 1993, tmdbId: 424, imdbId: "tt0108052", genre: "Drama, History", rating: "9.0", poster: `${IMG}/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg` },
  { title: "Django Unchained", year: 2012, tmdbId: 68718, imdbId: "tt1853728", genre: "Western, Drama", rating: "8.4", poster: `${IMG}/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg` },
  { title: "The Prestige", year: 2006, tmdbId: 1124, imdbId: "tt0482571", genre: "Drama, Mystery", rating: "8.5", poster: `${IMG}/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg` },
  { title: "Mad Max: Fury Road", year: 2015, tmdbId: 76341, imdbId: "tt1392190", genre: "Action, Sci-Fi", rating: "8.1", poster: `${IMG}/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg` },
  { title: "The Social Network", year: 2010, tmdbId: 37799, imdbId: "tt1285016", genre: "Drama, Biography", rating: "7.7", poster: `${IMG}/n0ybibhJtQ5icDqTp8eRytcIh6D.jpg` },
  { title: "Inglourious Basterds", year: 2009, tmdbId: 16869, imdbId: "tt0361748", genre: "War, Drama", rating: "8.3", poster: `${IMG}/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg` },
  { title: "The Grand Budapest Hotel", year: 2014, tmdbId: 120467, imdbId: "tt2278388", genre: "Comedy, Drama", rating: "8.1", poster: `${IMG}/eWDyYq6JX2qPGhsuQkHLa5oG2us.jpg` },

  // ── Animated ──
  { title: "Spirited Away", year: 2001, tmdbId: 129, imdbId: "tt0245429", genre: "Animation, Fantasy", rating: "8.6", poster: `${IMG}/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg` },
  { title: "Your Name", year: 2016, tmdbId: 372058, imdbId: "tt5311514", genre: "Animation, Romance", rating: "8.6", poster: `${IMG}/q719jXXEzOoYaps6babgKnONONX.jpg` },
  { title: "Howl's Moving Castle", year: 2004, tmdbId: 4935, imdbId: "tt0347149", genre: "Animation, Fantasy", rating: "8.2", poster: `${IMG}/TkTPELv4kC3u1lkloush8skOjE.jpg` },
  { title: "Princess Mononoke", year: 1997, tmdbId: 128, imdbId: "tt0119698", genre: "Animation, Fantasy", rating: "8.4", poster: `${IMG}/cMYCDADoLKLbB83g4WnJegaZimC.jpg` },
  { title: "Grave of the Fireflies", year: 1988, tmdbId: 12477, imdbId: "tt0095327", genre: "Animation, War", rating: "8.5", poster: `${IMG}/qG3RYlIVpTYclR9Uj8y3ckGaHvP.jpg` },
  { title: "Weathering with You", year: 2019, tmdbId: 568160, imdbId: "tt9426210", genre: "Animation, Fantasy", rating: "7.5", poster: `${IMG}/qgrk7r1fV4IjuoeiGS5HOhXNdLJ.jpg` },
  { title: "Suzume", year: 2022, tmdbId: 916224, imdbId: "tt16428256", genre: "Animation, Fantasy", rating: "7.7", poster: `${IMG}/vIeu8WysZrTSFb2uhPViKjX9EcC.jpg` },
  { title: "A Silent Voice", year: 2016, tmdbId: 378064, imdbId: "tt5323662", genre: "Animation, Drama", rating: "8.2", poster: `${IMG}/tuFaWiqX0TXoWu7DGNcmX3UW7sT.jpg` },
];

export const TOP_TV_SHOWS: CuratedTvShow[] = [
  // ── Recent / Ongoing ──
  { title: "The Last of Us", year: 2023, tmdbId: 100088, imdbId: "tt3581920", genre: "Drama, Action", rating: "8.8", seasons: 2, poster: `${IMG}/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg` },
  { title: "Shogun", year: 2024, tmdbId: 126308, imdbId: "tt2788316", genre: "Drama, War", rating: "8.7", seasons: 1, poster: `${IMG}/7O4iVfOMQmdCSxhOg1WnzG1AgmX.jpg` },
  { title: "Fallout", year: 2024, tmdbId: 106379, imdbId: "tt12637874", genre: "Sci-Fi, Drama", rating: "8.0", seasons: 1, poster: `${IMG}/AnsSKR9LuK0T9bAOcPVA3u6HBKO.jpg` },
  { title: "Baby Reindeer", year: 2024, tmdbId: 239770, imdbId: "tt22022452", genre: "Drama, Thriller", rating: "7.8", seasons: 1, poster: `${IMG}/aruYL5GjADOsHcPBzcNHBMfjLSn.jpg` },
  { title: "House of the Dragon", year: 2022, tmdbId: 94997, imdbId: "tt11198330", genre: "Fantasy, Drama", rating: "8.4", seasons: 2, poster: `${IMG}/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg` },
  { title: "Wednesday", year: 2022, tmdbId: 119051, imdbId: "tt13443470", genre: "Comedy, Fantasy", rating: "8.1", seasons: 2, poster: `${IMG}/9PFonBIUDcdKWoFRSrQ3jv5jKBp.jpg` },
  { title: "The Bear", year: 2022, tmdbId: 136315, imdbId: "tt14452776", genre: "Drama, Comedy", rating: "8.6", seasons: 3, poster: `${IMG}/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg` },
  { title: "Severance", year: 2022, tmdbId: 95396, imdbId: "tt11280740", genre: "Sci-Fi, Thriller", rating: "8.7", seasons: 2, poster: `${IMG}/lFf6LLrQjYZMOqVhjx2jHXjyCLk.jpg` },

  // ── Modern Classics ──
  { title: "Breaking Bad", year: 2008, tmdbId: 1396, imdbId: "tt0903747", genre: "Crime, Drama", rating: "9.5", seasons: 5, poster: `${IMG}/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg` },
  { title: "Game of Thrones", year: 2011, tmdbId: 1399, imdbId: "tt0944947", genre: "Fantasy, Drama", rating: "9.3", seasons: 8, poster: `${IMG}/1XS1oqL89opfnV0O0EixjBRo6B8.jpg` },
  { title: "Stranger Things", year: 2016, tmdbId: 66732, imdbId: "tt4574334", genre: "Sci-Fi, Horror", rating: "8.7", seasons: 4, poster: `${IMG}/49WJfeN0moxb9IPfGn8AIqMGskD.jpg` },
  { title: "The Boys", year: 2019, tmdbId: 76479, imdbId: "tt1190634", genre: "Action, Sci-Fi", rating: "8.7", seasons: 4, poster: `${IMG}/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg` },
  { title: "Money Heist", year: 2017, tmdbId: 71446, imdbId: "tt6468322", genre: "Crime, Thriller", rating: "8.2", seasons: 5, poster: `${IMG}/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg` },
  { title: "Dark", year: 2017, tmdbId: 70523, imdbId: "tt5753856", genre: "Sci-Fi, Thriller", rating: "8.8", seasons: 3, poster: `${IMG}/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg` },
  { title: "Squid Game", year: 2021, tmdbId: 93405, imdbId: "tt10919420", genre: "Thriller, Drama", rating: "8.0", seasons: 2, poster: `${IMG}/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg` },
  { title: "Peaky Blinders", year: 2013, tmdbId: 60574, imdbId: "tt2442560", genre: "Crime, Drama", rating: "8.8", seasons: 6, poster: `${IMG}/vUUqzWa2LnHIVqkaKJBuQ7MRrjL.jpg` },
  { title: "The Witcher", year: 2019, tmdbId: 71912, imdbId: "tt5180504", genre: "Fantasy, Action", rating: "8.0", seasons: 3, poster: `${IMG}/7vjaCdMw15FEbXyLQTVa04URsPm.jpg` },
  { title: "Arcane", year: 2021, tmdbId: 94605, imdbId: "tt11126994", genre: "Animation, Action", rating: "9.0", seasons: 2, poster: `${IMG}/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg` },
  { title: "Better Call Saul", year: 2015, tmdbId: 60059, imdbId: "tt3032476", genre: "Crime, Drama", rating: "8.9", seasons: 6, poster: `${IMG}/fC2HDm5t0kHagfiTRx5Ub8x8Asg.jpg` },
  { title: "Chernobyl", year: 2019, tmdbId: 87108, imdbId: "tt7366338", genre: "Drama, History", rating: "9.4", seasons: 1, poster: `${IMG}/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg` },
  { title: "True Detective", year: 2014, tmdbId: 46648, imdbId: "tt2356777", genre: "Crime, Drama", rating: "8.9", seasons: 4, poster: `${IMG}/cuV2O5ZyDLHSOWzg3nLVljp1ubw.jpg` },
  { title: "The Mandalorian", year: 2019, tmdbId: 82856, imdbId: "tt8111088", genre: "Sci-Fi, Action", rating: "8.7", seasons: 3, poster: `${IMG}/eU1i6eHXlzMOlEq0ku1Bdo7IkYe.jpg` },
  { title: "Succession", year: 2018, tmdbId: 76331, imdbId: "tt7660850", genre: "Drama", rating: "8.8", seasons: 4, poster: `${IMG}/7HW47XbkNQ5fiwQFYGWdw9gs7LF.jpg` },
  { title: "The Queen's Gambit", year: 2020, tmdbId: 87739, imdbId: "tt10048342", genre: "Drama", rating: "8.6", seasons: 1, poster: `${IMG}/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg` },
  { title: "Fleabag", year: 2016, tmdbId: 67070, imdbId: "tt5687612", genre: "Comedy, Drama", rating: "8.7", seasons: 2, poster: `${IMG}/27vEYsRKa3eGtDAFnEIrJwBfVdp.jpg` },
  { title: "Mr. Robot", year: 2015, tmdbId: 62560, imdbId: "tt4158110", genre: "Crime, Drama", rating: "8.5", seasons: 4, poster: `${IMG}/oKIBhzZzDX07SoE2bOLhq2EE8rf.jpg` },
  { title: "Attack on Titan", year: 2013, tmdbId: 1429, imdbId: "tt2560140", genre: "Animation, Action", rating: "9.1", seasons: 4, poster: `${IMG}/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg` },
  { title: "Death Note", year: 2006, tmdbId: 13916, imdbId: "tt0877057", genre: "Animation, Thriller", rating: "9.0", seasons: 1, poster: `${IMG}/g8fclEHOeesMnBFwVkx5x0FZbfn.jpg` },
  { title: "Invincible", year: 2021, tmdbId: 95557, imdbId: "tt6741278", genre: "Animation, Action", rating: "8.7", seasons: 2, poster: `${IMG}/yDWJYRAwMNKbIYT8ZB33qy84uzO.jpg` },
  { title: "The Penguin", year: 2024, tmdbId: 194764, imdbId: "tt15435876", genre: "Crime, Drama", rating: "8.5", seasons: 1, poster: `${IMG}/bPU4OEwFJQsYCxJMtF5MStYhj5a.jpg` },
];
