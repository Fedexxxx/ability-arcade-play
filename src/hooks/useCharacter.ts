import { useEffect, useState } from "react";
import {
  CHARACTER_EVENT,
  getCharacterState,
  type CharacterState,
} from "@/lib/character/state";

/** Live character state (selected id + owned gear-tier ids). */
export function useCharacter(): CharacterState {
  const [s, setS] = useState<CharacterState>(() => getCharacterState());
  useEffect(() => {
    const sync = () => setS(getCharacterState());
    window.addEventListener(CHARACTER_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHARACTER_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return s;
}
