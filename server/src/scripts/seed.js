import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import mongoose from "mongoose";
import { Book } from "../models/Book.js";
import { Genre } from "../models/Genre.js";
import { User } from "../models/User.js";

const BOOKS_DATA = [
  // Fiction
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    publishedYear: 1960,
    description:
      "The story of young Scout Finch in Maycomb, Alabama, whose father Atticus Finch defends a Black man falsely accused of rape — a profound meditation on racial injustice and moral courage."
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    publishedYear: 1925,
    description:
      "A portrait of the Jazz Age's excess and illusion through narrator Nick Carraway as he observes the obsessive dreams and tragic fate of his mysterious neighbor Jay Gatsby."
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    publishedYear: 1951,
    description:
      "Holden Caulfield, recently expelled from prep school, narrates his aimless wandering through New York City while grappling with identity, alienation, and the 'phoniness' of the adult world."
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    publishedYear: 1988,
    description:
      "A young Andalusian shepherd named Santiago journeys to Egypt in search of buried treasure, learning along the way about the language of the universe and following one's personal legend."
  },
  {
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    genre: "Fiction",
    publishedYear: 1987,
    description:
      "A melancholic coming-of-age story set in late-1960s Tokyo, tracing student Toru Watanabe's memories of lost friends, romantic longing, and the grief that shapes his youth."
  },
  // Dystopian
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    publishedYear: 1949,
    description:
      "Winston Smith lives under the omnipresent surveillance of Big Brother in a totalitarian super-state that erases history, controls thought, and demolishes individual freedom."
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian",
    publishedYear: 1932,
    description:
      "A future society controls its citizens through genetic engineering, conditioning, and pleasure, having sacrificed freedom and individuality for a shallow, permanent contentment."
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    genre: "Dystopian",
    publishedYear: 1953,
    description:
      "In a future America where books are outlawed and burned, fireman Guy Montag begins to question the anti-intellectual society he enforces and secretly starts reading the books he was meant to destroy."
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    genre: "Dystopian",
    publishedYear: 2006,
    description:
      "A father and his young son travel through a bleak, ash-covered America after an unnamed catastrophe, carrying the fire of humanity in a world where hope has almost entirely been extinguished."
  },
  // Fantasy
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    publishedYear: 1954,
    description:
      "Hobbit Frodo Baggins must destroy the One Ring — an artifact of terrible power — before the dark lord Sauron can use it to enslave all of Middle-earth, joined by a fellowship of nine companions."
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    publishedYear: 1937,
    description:
      "Quiet, comfort-loving Bilbo Baggins is swept into an epic quest to reclaim the Lonely Mountain and its treasure from the fearsome dragon Smaug, discovering unexpected reserves of courage."
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    publishedYear: 1997,
    description:
      "An orphaned boy discovers on his eleventh birthday that he is a famous wizard, enters Hogwarts School, and uncovers the truth about his parents' deaths and the dark wizard who wants to return."
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    publishedYear: 2007,
    description:
      "The legendary Kvothe recounts his own life story in his own words — from orphaned troupe child to gifted student at the University to feared adventurer — a tale of love, music, and hard-won knowledge."
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    genre: "Fantasy",
    publishedYear: 1968,
    description:
      "Ged, a young boy of great power on the archipelago of Earthsea, rashly unleashes a nameless shadow upon the world and must voyage to the ends of the earth to confront it and himself."
  },
  // Science Fiction
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    publishedYear: 1965,
    description:
      "On the desert planet Arrakis, sole source of the universe's most precious substance, young Paul Atreides navigates treacherous politics and leads a rebellion that will change galactic history."
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    genre: "Science Fiction",
    publishedYear: 1979,
    description:
      "Moments before Earth is demolished to make way for a hyperspace bypass, average Englishman Arthur Dent is whisked into space by his alien friend Ford Prefect, beginning a wildly improbable adventure."
  },
  {
    title: "Ender's Game",
    author: "Orson Scott Card",
    genre: "Science Fiction",
    publishedYear: 1985,
    description:
      "Child prodigy Andrew 'Ender' Wiggin is recruited to an orbital Battle School where children train in zero-gravity combat, being shaped — unknowingly — into humanity's ultimate military commander."
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    genre: "Science Fiction",
    publishedYear: 2011,
    description:
      "Presumed dead and left behind on Mars after a freak storm, botanist-astronaut Mark Watney must survive on a hostile planet using science, ingenuity, and dark humor until a rescue can reach him."
  },
  // Mystery
  {
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    publishedYear: 1902,
    description:
      "Sherlock Holmes and Dr. Watson investigate the legend of a spectral hound said to haunt the Baskerville family on the foggy moors of Devonshire, with deadly consequences."
  },
  {
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    genre: "Mystery",
    publishedYear: 1934,
    description:
      "Detective Hercule Poirot, stranded aboard a snowbound luxury express, must untangle an impossible murder where every single passenger aboard appears to have had a motive."
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Mystery",
    publishedYear: 2005,
    description:
      "Disgraced journalist Mikael Blomkvist and brilliant but deeply troubled hacker Lisbeth Salander partner to solve a decades-old disappearance buried within a powerful Swedish industrial dynasty."
  },
  // Thriller
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Thriller",
    publishedYear: 2003,
    description:
      "Harvard symbologist Robert Langdon is drawn into a frantic chase across Europe to unravel a centuries-old conspiracy involving secret societies, the Holy Grail, and the works of Leonardo da Vinci."
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Thriller",
    publishedYear: 2012,
    description:
      "On the morning of their fifth wedding anniversary, Nick Dunne's wife Amy vanishes. As the investigation unfolds, dark truths about their marriage surface — and every new revelation shifts the suspect."
  },
  {
    title: "The Silence of the Lambs",
    author: "Thomas Harris",
    genre: "Thriller",
    publishedYear: 1988,
    description:
      "FBI trainee Clarice Starling must enter a maximum-security asylum to consult imprisoned cannibal psychiatrist Hannibal Lecter, hoping his unique insights will help catch a terrifying serial killer."
  },
  // Non-fiction
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "Non-fiction",
    publishedYear: 2011,
    description:
      "A sweeping narrative of human history from the Stone Age through the twenty-first century, examining the cognitive, agricultural, and scientific revolutions that shaped our world."
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Non-fiction",
    publishedYear: 1988,
    description:
      "Stephen Hawking's landmark popular science book explores cosmology for general readers — covering the Big Bang, black holes, the nature of time, and humanity's place in the universe."
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined. Make sure .env is loaded.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Find or create the admin user to use as createdBy
  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.error(
      "Admin user not found. Start the server once first so the admin account is seeded."
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Using admin: ${admin.email}`);

  // Clear existing books
  const deleted = await Book.deleteMany({});
  console.log(`Deleted ${deleted.deletedCount} existing books`);

  // Collect unique genre names
  const uniqueGenreNames = [...new Set(BOOKS_DATA.map((b) => b.genre))];

  // Upsert genres
  const genreMap = {};
  for (const name of uniqueGenreNames) {
    let genre = await Genre.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (!genre) {
      genre = await Genre.create({ name });
      console.log(`Created genre: ${name}`);
    } else {
      console.log(`Found existing genre: ${name}`);
    }
    genreMap[name] = genre._id;
  }

  // Create books
  const booksToInsert = BOOKS_DATA.map((b) => ({
    title: b.title,
    author: b.author,
    genre: genreMap[b.genre],
    publishedYear: b.publishedYear,
    description: b.description,
    active: true,
    createdBy: admin._id
  }));

  await Book.insertMany(booksToInsert);
  console.log(`Seeded ${booksToInsert.length} books`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
