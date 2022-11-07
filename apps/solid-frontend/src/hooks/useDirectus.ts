import { useContext } from "solid-js";

import { DirectusContext } from "..";

export const useDirectus = () => useContext(DirectusContext);