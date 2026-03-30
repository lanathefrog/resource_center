import { useEffect, useState } from "react";

export function useGenres(api) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    api.listGenres().then(setGenres).catch(() => {});
  }, [api]);

  return genres;
}
